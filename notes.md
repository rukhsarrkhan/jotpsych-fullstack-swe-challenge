Development Notes - Issues Faced and Debugging Process


Missing Authorization Header

Issue: Frontend was not sending the JWT token.
Fix: Added the token to the Authorization header in the fetch request.

Working Outside of Application Context

Issue: RuntimeError when accessing the database inside a thread.
Fix: Used app.app_context() within the thread.

Incorrect Number of Values in Identifier

Issue: InvalidRequestError with session.get().
Fix: Ensured get_jwt_identity() returns the user ID directly.

Decryption Error

Issue: Incorrect padding error during decryption.
Fix: Proper encoding/decoding of the motto, added detailed logging.


Approach to the Tasks

Frontend----

Audio Recording: Used the MediaRecorder API, limited to 15 seconds.
Sent the audio blob to /upload on completion.

Backend----

File Upload Handling: Created /upload endpoint to receive audio blobs.
Simulated transcription in a thread.
Encrypted the transcribed motto with Fernet.
Stored encrypted motto, decrypted when retrieving user info.

Additional Notes
Error Handling: Added comprehensive error handling and logging.
Concurrency: Handled multiple uploads by processing each in a separate thread.
Security: Encrypted user motto before storing in the database.

Future Steps
Figure out issue with decryption in the audio blob and fix it


Notes:
/record-motto is /audio :)
App version change mock works when version is changed in APIService 
Audio recording works, encryption works, decryption fails - this was the only remaining component of the challenge, will still work on it, want to finish it, let's see how it goes :)





