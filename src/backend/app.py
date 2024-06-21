from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from packaging import version
from cryptography.fernet import Fernet
import os
import time
import threading
import random

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

key = Fernet.generate_key()
cipher_suite = Fernet(key)

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'

    CORS(
        app,
        resources={r"*": {"origins": ["*"]}},
        allow_headers=["Authorization", "Content-Type", "app-version"],
        methods=["GET", "POST", "OPTIONS"],
        max_age=86400,
        supports_credentials=True
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def check_app_version():
        app_version = request.headers.get('app-version')
        if app_version and version.parse(app_version) < version.parse("1.2.0"):
            return jsonify({'message': 'Please update your client application'}), 426

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=user.id)
            response = make_response(jsonify({'message': 'Login successful', 'token': access_token}), 200)
            return response
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/upload', methods=['POST'])
    @jwt_required()
    def upload():
        if 'audio' not in request.files:
            return jsonify({"message": "No audio file provided"}), 400

        audio_file = request.files['audio']
        user_id = get_jwt_identity()

        def process_transcription(user_id, audio_file):
            with app.app_context():
                try:
                    time.sleep(random.randint(5, 15))
                    transcript = "This is a transcribed audio."

                    encrypted_motto = cipher_suite.encrypt(transcript.encode())
                    encrypted_motto_str = encrypted_motto.decode('utf-8')

                    print(f"Encrypted motto: {encrypted_motto_str}")

                    user = db.session.get(User, user_id)
                    if user:
                        user.motto = encrypted_motto_str
                        db.session.commit()
                except Exception as e:
                    print(f"Error during transcription processing: {e}")

        threading.Thread(target=process_transcription, args=(user_id, audio_file)).start()

        return jsonify({"message": "Audio uploaded successfully"}), 202

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if user and user.motto:
            try:
                encrypted_motto = user.motto.encode('utf-8')
                print(f"Encrypted motto before decryption: {encrypted_motto}")
                decrypted_motto = cipher_suite.decrypt(encrypted_motto).decode('utf-8')
                print(f"Decrypted motto: {decrypted_motto}")
            except Exception as e:
                print(f"Decryption error: {e}")
                decrypted_motto = "Decryption error"
        else:
            decrypted_motto = None
        return jsonify({"username": user.username, "motto": decrypted_motto})

    return app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    motto = db.Column(db.Text, nullable=True)

if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True)
