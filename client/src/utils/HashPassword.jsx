import axios from 'axios';

export default async function hashPassword(password, email, _callback) {

  console.log("(hashPassword) email: " + email);
  console.log("(hashPassword) password: " + password);

  axios
    .post(process.env.REACT_APP_SERVER_BASE_URI + 'accountsalt', {
      email
    })
    .then(res => {
      let saltObject = res;

      console.log("saltObject: " + JSON.stringify(saltObject));

      if (saltObject.status === 200) {
        let hashAlg = saltObject.data.result[0].password_algorithm;
        let salt = saltObject.data.result[0].password_salt;

        //Get hash algorithm
        switch (hashAlg) {
          case 'SHA512':
            hashAlg = 'SHA-512';
            break;
          default:
            break;
        }

        let saltedPassword = password + salt;

        // Encode salted password to prepare for hashing
        const encoder = new TextEncoder();
        const data = encoder.encode(saltedPassword);

        let hashedPassword;

        // Hash salted password
        crypto.subtle.digest(hashAlg, data).then(res => {
          // Decode hash with hex digest
          let hash = res;
          let hashArray = Array.from(new Uint8Array(hash));
          hashedPassword = hashArray
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

          console.log("email: " + email);
          console.log("password: " + password);
          console.log("saltedPassword: " + saltedPassword);
          console.log("hashedPassword: " + hashedPassword);

          _callback(hashedPassword);
        });

        /*console.log("email: " + email);
        console.log("password: " + password);
        console.log("saltedPassword: " + saltedPassword);
        console.log("hashedPassword: " + hashedPassword);

        _callback(hashedPassword);*/
      }
    });

  //return hashedPassword;
};