const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const Sib = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt');

const User = require('../model/User');
const Forgotpassword = require('../model/forgotPassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            const SibApiV3Sdk = require('sib-api-v3-sdk');
            const defaultClient = SibApiV3Sdk.ApiClient.instance;

            // Configure API key authorization: api-key
            const apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;

            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

            sendSmtpEmail.subject = 'Sending with Sendinblue is Fun';
            sendSmtpEmail.htmlContent = `<a href="http://localhost:3501/password/resetpassword/${id}">Reset password</a>`;
            sendSmtpEmail.sender = {"name":"Ashish","email":"ashishnandwana2@gmail.com"};
            sendSmtpEmail.to = [{"email": email}];

            apiInstance.sendTransacEmail(sendSmtpEmail)
            .then((response) => {
                const statusCode = response.status || 200
                return res.status(statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
            })
            .catch((error) => {
                throw new Error(error);
            })
        } else {
            throw new Error('User doesn\'t exist');
        }
    } catch(err){
        console.error(err);
        return res.json({ message: err, sucess: false });
    }
}


const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}