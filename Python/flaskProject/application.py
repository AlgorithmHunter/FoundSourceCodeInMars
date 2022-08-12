
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, make_response, Response

import mysql.connector

import os
import boto3
import json
import re
import secrets
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet
import requests
#initialize configuration settings
configFile = open('AppConfig.json')
configData = json.load(configFile)
#initalize flask application
application = Flask(__name__)

application.config['UPLOAD_FOLDER'] = configData['UPLOAD_FOLDER']
application.secret_key = configData['SECRET_KEY']


def sqlconnection():
   mycon=None
   try:
      #connect to mysql database server
    mycon=mysql.connector.connect(host=configData['SQL_HOST'],user=configData['SQL_USER'],passwd=configData['SQL_PASSWORD'],port=configData['SQL_DB_PORT'],database=configData['SQL_DB'])
   except Exception as e:
      print(str(e))
      logger.error(str(e))
   return mycon

@application.route('/Auth/Register', methods=['GET', 'POST'])
def Register():
#check if http method is POST and if required form fields are sent with the http request
 if request.method == 'POST' and 'email' in request.form and 'username' in request.form and 'password' in request.form:
    #Initialize sql connection
    mySqlConnection = sqlconnection()
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    passMatch=request.form['passwordMatch']
    #Create a cursor with dictionary on to make sure the results of the query
    #can be accessed with keys
    cursor = mySqlConnection.cursor(dictionary=True)
    #execute select query and return all users matching the email
    cursor.execute("Select * from users where email LIKE %s", [email])
    #from the returned results of the query select one set
    user = cursor.fetchone()
    #check if returned user and form data meet the conditions
    #if it meets conditions insert new user to the database 
    if user:
       flash("user already exist "+str(user['userid']), "Danger")
    elif not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}',password):
       flash("password must contain atleast 7 none numeric characters & and one single number", "Danger")
    elif  not username  or not  password  or not email  or not passMatch:
        flash("field cannot be empty", "Danger")
    elif  password!=passMatch:
       flash("passwords dont match", "Danger")
    else:
       query = "insert into users(username,email,password) values(%s,%s,%s)"
       values = (username, email, generate_password_hash(password))
       cursor.execute(query, values)
       mySqlConnection.commit()

       return redirect(url_for('Login'))

 return render_template('Register.html', title="File Uploader - Register")

#render our home page
@application.route('/')
def Home():
    return redirect(url_for('Login'))



@application.route('/Auth/Login', methods=['GET', 'POST'])
def Login():
#return form data from the http request
#validate the returned form data
#execute select command qeuery check if the user from the login form matches any user in the database
#if true allow the user to login to the site and create a session variable
#to keep the persistant state of the user during their login
 if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
    email = request.form['email']
    password = request.form['password']
    mySqlConnection = sqlconnection()
    cursor = mySqlConnection.cursor(dictionary=True)
    cursor.execute("Select * from users where email LIKE %s", [email])
    user =cursor.fetchone()
    error = None

    if user is None:
      
       flash("username or password error","Danger")
    elif check_password_hash(user['password'], password) == False:
       
       flash("username or password error","Danger")
    elif not password or not email:
       
         flash("field cannot be empty","Danger")
    else:
       session.clear()
       session['userid'] = user['userid']
       session['email'] = user['email']
       session['username']=user['username']
       return redirect(url_for('UploadFiles'))

    
 return render_template('Login.html', title="File Uploader - Login")

#logout the user. Clear session data and navigate user to login page.
@application.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('Login'))


@application.route('/User/FileUploader', methods=['GET', 'POST'])
def UploadFiles():
   #Get user session id
   userid = session.get('userid')
   mySqlConnection = sqlconnection()
   #Check if the user is logged in
   if userid is None:
      redirect(url_for('Login'))
   else:
       emails=[]
       newFiles=[]
       if request.method == 'POST' and 'email1' in request.form:
         #Create an array of emails
         #Check if the email are not empty from the array of emails
         #If not empty append to new array that holds none empty emails
         emailstemp = [request.form['email1'], request.form['email2'],
         request.form['email3'], request.form['email4'], request.form['email5']]
         for email in emailstemp:
            if email is not None:
               emails.append(email)
         Filesuploaded=False
         #get list of files uploaded by the user               
         files=request.files.getlist('file')
         #Iterate through the list of files 
         for file1 in files:
           #Get the filename from the file
           filefullname = file1.filename
           #Split filename by dot character and get the last index value consisting of file extension
           #Note this can also work filefullname.split(".")[1]
           fileExtension = filefullname.split(".")[-1]
           #split filename by dot and get the first index with the file fullname
           #Note this can also work filefullname.split(".")[0]
           filename = filefullname.split(".")[:-1][0]
           #Generate a new file name by combining it with a token and a file extension
           key = str(secrets.token_urlsafe(16))+"."+fileExtension
           #Map the new file name with the physical app file path
           filepath = os.path.join(configData['UPLOAD_FOLDER'], key)
           
           #Save the new file to the mapped app upload folder
           file1.save(filepath)
           #Append added file to the array of files to send with email
           newFiles.append(request.host_url +filepath.replace("./","/"))
           Filesuploaded=True
           #Add new file to files table in the database
           cursor = mySqlConnection.cursor(dictionary=True)
           query = "insert into files(fileuri,userid) values(%s,%s)"
           values = (filepath,session.get("userid"))
           cursor.execute(query, values)
           mySqlConnection.commit()
           #Here we get the new added file in the database
           #so we can insert it to the fileviews table  
           query1 = "select * from files where userid=%s order by fileid desc limit 1"
           value=session.get('userid')
           cursor.execute(query1,[value])
           qfile=cursor.fetchone()
           newFiles.append(request.host_url +filepath.replace("./","/")+"?fileid="+str(qfile['fileid']))
           for email in emailstemp:
            if email is not None:
               #We add each and every email user we're going to send the file to
               #to the fileviews table so that we can track them wenever they view the file
               query2="insert into fileviews(vieweremail,viewed,fileid)values(%s,%s,%s)"   
               values1 = (email,False,qfile['fileid'])
               cursor.execute(query2, values1)
               mySqlConnection.commit()
            
         if Filesuploaded:
            #If connected to aws servers. this function will trigger the function to send
            #emails consisting of uploaded files to selected emails,using aws lamda
            #temp = {"recipients": emails, "sender": session.get('email'),"files":newFiles}
            #url=configData['LAMDA_REQUEST_URI']
            #pos=requests.post(url,json=json.dump(temp))
            
            #if files where uploaded successfully send a good alert back to the user
            flash("files submited successfully","Good")
         else:
            
            flash("no files submited","Danger")
            
        
   return render_template('UploadFiles.html',title="File Uploader - Upload",username=session.get('username'))       

@application.route('/User/Files', methods=['GET'])
def GetFiles():
    #check if the user is loged in before you get the files from the database
    userid=session.get('userid')
    mySqlConnection = sqlconnection()
    if userid is not None:
        #Get all the files matching the loged in user
        cursor = mySqlConnection.cursor(dictionary=True)
        cursor.execute("Select * from files where userid = %s",[userid])
        files=cursor.fetchall()
        #convert the list to javascript object notation format
        #and send back the response to the user
        response=application.response_class(response=json.dumps(files),status=200,mimetype="application/json")
        return response     
    else:
        redirect(url_for('Login'))

@application.route('/User/DeleteFiles')
def DeleteFiles():
    #To delete all the files we first if the user is loged on
    #if true then we execute the select query to get the files that belong to the user
    #if the files are returned we first delete them from the server and then
    #we delete them from the views and then followed by the fileviews table
    #And then commit
    userid=session.get('userid')
    mySqlConnection = sqlconnection()
    if userid is not None:
        cursor = mySqlConnection.cursor(dictionary=True)
        cursor.execute("Select * from files where userid = %s",[userid])
        files=cursor.fetchall()
        for file in files:
           if os.path.exists(file['fileuri']):
              os.remove(file['fileuri'])
           cursor.execute("delete from fileviews where fileid = %s",[file['fileid']])
           mySqlConnection.commit()
        cursor.execute("delete from files where userid = %s",[userid])
        mySqlConnection.commit()
        return redirect(url_for('UploadFiles'))     
    else:
        redirect(url_for('Login'))

@application.route('/User/FileView', methods=['GET'])
def FileView():
    #Get the query string with the file id that the user wants to view
    #If the query string is not provided redirect to the login page 
    fileid=request.args.get('fileid')
    if fileid is None:      
        redirect(url_for('Login'))
    mySqlConnection = sqlconnection()
    #The following code is used to track file views by user email
    #First it updates file view to true if the email is valid
    #Then checks if the file has been viewed by all users
    #Who the file belongs to within the database table fileviews
    #If all users have viewed the file then it gets deleted from the
    #server and the database
    email=request.args.get('eml')
    if email is not None:
       cursor = mySqlConnection.cursor(dictionary=True)
       #fn=Fernet(configData['SECRET_KEY'])
       newemail=email
       if newemail:
         newquery="update fileviews set viewed=%s where vieweremail=%s"
         newvalues=(True,newemail)
         cursor.execute(newquery,newvalues)
         mySqlConnection.commit()
         newquery2="select fileid from fileviews where vieweremail=%s"
         cursor.execute(newquery2,[newemail])
         view=cursor.fetchone()
         if view:

           newquery3="select * from fileviews where fileid = %s"
           cursor.execute(newquery3,[fileid])
           fileviews=cursor.fetchall()
           viewedAll=True
           for viewf in fileviews:
              if viewf['viewed']==False:
                viewedAll=False
           if viewedAll:
              newquery4="delete from fileviews where fileid = %s"
      
              cursor.execute(newquery4,[view['fileid']])
              mySqlConnection.commit()
              cursor.execute("Select  * from files where fileid = %s",[view['fileid']])
              files=cursor.fetchone()
              if os.path.exists(files['fileuri']):
                os.remove(files['fileuri'])
              cursor.execute("delete from files where fileid = %s",[view['fileid']])
              mySqlConnection.commit()

    return render_template('FileView.html',title="File Uploader - View File")        

if __name__=='__main__':
   application.run(host=configData['APP_HOST'],port=configData['APP_HOST_PORT'],debug = True)