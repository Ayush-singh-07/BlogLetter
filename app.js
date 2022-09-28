const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get('/' , (req,res)=>{
    console.log(__dirname);
    res.sendFile(__dirname+"/signup.html");
})


app.post('/' , (req,res)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email  = req.body.email;


    const data ={
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                      FNAME: fname,
                      LNAME: lname
                }
            }
        ],
        update_existing: true,
    }


    const jsondata = JSON.stringify(data);
    const listid='aa20e8b006';
    const apiKey ='877edf5e1ae94d673a915117d49841d2-us1';

    const url ='https://us1.api.mailchimp.com/3.0/lists/'+listid;

    const options= {
        method: 'POST',
        auth: 'ayush007:'+apiKey
    }


    const request= https.request(url, options, (response)=>{                        //post data to external 
        response.on('data', (d)=>{
            parsedData = JSON.parse(d);

            //console.log(response); // http request() has given us the response which had statuscode (request Headers)

            if(response.statusCode === 200){
                console.log(response.statusCode);
                res.sendFile(__dirname+"/success.html")
            }
            else{
                res.sendFile(__dirname+'/faliure.html')
            }

            // getting the error reason
            if(parsedData.errors.length ===0){
                console.log('request Successfull')
            }
            else{
                console.log('Mailchimp says: '+parsedData.errors[0].error);
            }

        })
    })


    //first we have to save our request in a constant later 
    //we can use that request to send 'request.end()' data using writing in the 
    //request 
    // refer : https://stackoverflow.com/questions/38844796/nodejs-sending-external-api-post-request

    request.write(jsondata);
    request.end();

})




app.post('/faliure', (req, res)=>{
    res.redirect('/');
})




app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is listening at 3000');
})
