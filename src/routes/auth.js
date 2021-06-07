import { Router } from 'express';
import Zk from '@nuid/zk';
import { 
  createCredentials,
  getCredentails,
  challengeCredentials,
  verifyProof,
  decodeJwtPayload 
} from '../utils/nuid';
import { sign } from 'jsonwebtoken';

let User;
const router = new Router();

const setUserModel = (userModel) => {
  User = userModel;
};

router.post('/signup', async (req, res) => {
  // console.log(req.body);
  try {
    // console.log('pass: ',req.body.password);
    let verifiableSecret = Zk.verifiableFromSecret(req.body.password);
    let credentials = await createCredentials(verifiableSecret);

    // console.log('Credentails data...', credentials);
    let id = credentials['nu/id'];
    const newUser = new User({
      email: req.body.email,
      nuid: id,
      name: req.body.name
    });
    await newUser.save();
    return res.status(200).send("sigup successful");
  } catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.trim() });
    if (!user) {
      return res.status(400).send('Wrong Credentials');
    }
    // Get credentials of the user using public id
    let credentialResponse = await getCredentails(user.nuid);

    //find transaction
    console.log(credentialResponse['nuid/credential']);
    const challenge = Zk.defaultChallengeFromCredential(credentialResponse['nuid/credential']) // retrieve credential (db, ledger, ...)

    const proof = Zk.proofFromSecretAndChallenge(req.body.password, challenge)

    const verifiable = Zk.verifiableFromProofAndChallenge(proof, challenge)
    
    if(Zk.isVerified(verifiable)) {
      let localJwt = sign({ id: user.nuid }, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({
        jwt: localJwt
      });
    }else{
      return res.status(400).send('bad Request');
    }

  }catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = {
  setUserModel,
  router
};
