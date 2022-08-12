import os
import boto3
import json
from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
configFile = open('AppConfig.json')
configData=json.load(configFile)


s3 = boto3.client(
    's3',
   aws_access_key_id = configData['AWS_ACCESS_KEY_ID'],
	aws_secret_access_key =configData['AWS_SECRET_ACCESS_KEY'],
	region_name =configData['REGION_NAME']
    )
    

ses_client = boto3.client(
    'ses',
    aws_access_key_id = configData['AWS_ACCESS_KEY_ID'],
	aws_secret_access_key =configData['AWS_SECRET_ACCESS_KEY'],
	region_name =configData['REGION_NAME']
    )

def send_email(sender,recipient,filepath):
  

    BODY = """\
    <html>
    <body>
    <h1>File Uploader</h1>
    <p>Hi. You've received file attachments from student file uploader application. Enjoy viewing the files</p>+
    "<a href='"""
    BODY+=filepath+"'>"+filepath+"</a>"+"</body>"+"</html>"
    
    
    msg = MIMEMultipart('mixed')
   
    msg['Subject'] = "You're received file. please see link"
    msg['From'] = sender
    msg['To'] = recipient

    
    msg_body = MIMEMultipart('alternative')

   
    htmlpart = MIMEText(BODY.encode("utf-8"), 'html', "utf-8")

    msg_body.attach(htmlpart)
 
    msg.attach(msg_body)

    
    msg.attach(att)
 
    try:
      
        response = ses_client.send_raw_email(
            Source=sender,
            Destinations=[
                recipient
            ],
            RawMessage={
                'Data':msg.as_string(),
            }

        )
   
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent")


def lambda_handler(event, context):
    emailsfile = json.loads(event.body)
    
        
    recipients= emailsfile['recipients']
    files=emailsfile['files']
    for file in files:
       for recipient in recipients:
          send_email(emailsfile['sender'],recipient,file)


    return {
        'statusCode': 200,
        'body': json.dumps({"reponse":"Emails sent succesfuly"})
    }
