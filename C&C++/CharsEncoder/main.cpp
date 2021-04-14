//Developer:Collins Maleta
//CopyRights:No one is allowed to reproduce this project in anyway without written permissions from the code author
//APP Description
//--------------------
//This console app takes in a string of characters from user specified file  then changes or hides all characters that matches
//the ones from inputchars {'0','1','2','3','4','5','6','7','8','9','e',' '}; with the ones from outputchars {'0','1','2','3','4','5','6','7','8','9','e',' '}
//

#include <iostream>
#include <fstream>
#include <ctype.h>
#include <string>
#include <sstream>
#include <algorithm>
#include <iterator>
#include <chrono>
#include<ctime>
#include<vector>
#include<set>
#include<cstdlib>
#include<windows.h>

using namespace std;
string EncodeChars(string data,char InputChars[],char OutputChars[]);
void output(string filename,string encodedData,string originalData);
vector<string> StringSpliter(string data,char splitChar)
{
   string str(data),buf;
               // Have a buffer string
    std::stringstream ss(str);       // Insert the string into a stream

  vector<std::string> tokens; // Create vector to hold our words

    while (getline(ss, buf, splitChar))
        tokens.push_back(buf);
    return tokens;
}

//Converts a string of upper case chars to a string of lower case chars
string tolowerString(string value)
{
    string newvalue="";
    int valueLength=value.length();
    for(int i=0; i<valueLength; i++)
    {
        newvalue+=tolower(value[i]);
    }
    return newvalue;
}
string GetTime()
{

    std::time_t t= std::time(0);
    std::tm* now=std::localtime(&t);
    auto mytime= to_string(now->tm_year +1900) +"/"+ to_string(now->tm_mon+1) +"/"+to_string(now->tm_mday);
    return mytime;
}

string GetLongTime()
{
    auto start=std::chrono::system_clock::now();
    auto end=std::chrono::system_clock::now();

    std::chrono::duration<double> elapsed_seconds=end-start;
    std::time_t end_time=std::chrono::system_clock::to_time_t(end);
    auto mylongtime=ctime(&end_time);
    return mylongtime;
}
int main()
{

    ifstream ArrestDataInFile;
    string ArrestData,InputFileName,OutputFileName;
    string fileExtension=".dat";
    char InputChars[]= {'0','1','2','3','4','5','6','7','8','9','e',' '};
    char OutputChars[]= {'@','!',')','E','<','&','$','>','*','?','h','-'};
    char canContinue='\0';


    cout<<"Welcome to my CharsEncoder console app"<<endl;
    cout<<"--------------------------------------"<<endl;
    cout<<"Date Accessed:"<<GetLongTime()<<endl;

    cout<<endl;
  //  while( canContinue!='N')
  // {


        cout <<"Enter the input filename with extension e.g .dat,.txt:"<<endl;
        cin>>InputFileName;
        cout <<"Enter the output filename without extension e.g .dat,.txt:" <<endl;
        cin>>OutputFileName;
        cout<<endl;

        ArrestDataInFile.open(tolowerString(InputFileName));
        if (ArrestDataInFile.fail())
        {
            cout<<"Error while trying to open your file '"<<InputFileName<<endl;
            exit(-1);
        }
      auto  splits=  StringSpliter(InputFileName,'.');
        fileExtension=splits[1];



        getline(ArrestDataInFile,ArrestData);


        int arrestDataLength=ArrestData.length();

//This loop iterates through all chars from the ArrestData file which are stored inside ArrestData string variable
//The loop body declares iScharacterMatch boolean variable  which will be assigned a value of true if
//ArrestData char matches any char from InputChars list
//The inner loop  goes through each characters in inputChars array
//If ArrestData char matches any character from inputChars
//The matching char from ArrestData is replaced with a new char from OutputChars list
//The newArrestData string variable records all the new changes which were made on ArrestData
//If there's no match in ArrestData and InputChars, and ArrestData character is not upper case then
//assign the original character from ArrestData string to newArrestData string

        auto newArrestData=EncodeChars(ArrestData,InputChars,OutputChars);
//Reads a string of new transformed chars into user defined outputfile




       ArrestDataInFile.close();

     output(OutputFileName+"."+fileExtension,newArrestData,ArrestData);
        //cout<<"Do you still want to encode more text files Sir/Mem"<<endl;
      //  cin>>canContinue;
 //   }

    return 0;
}
void Error(fstream & fs)
{

///Has to be a way
}
string EncodeChars(string data, char InputChars[],  char OutputChars[])
{
    string newData="";

    auto arrestDataLength=data.length();
    for (int i=0; i<arrestDataLength; i++)
    {
        bool isCharacterMatch=false;
        for(int j=0; j<12; j++)
        {
            if(data[i]==InputChars[j])
            {
                newData+=OutputChars[j];
                isCharacterMatch=true;
            }
        }
        if(!(isCharacterMatch) && !(isupper(data[i])))
        {
            newData+=data[i];
        }
    }
    return newData;
}
void output(string filename,string encodedData,string originalData)
{
    //Open user output file for reading
    string outArrestData;

    ifstream newArrestDataInFile(filename);

    ofstream ArrestDataOutFile(filename);


    if(newArrestDataInFile.fail() || ArrestDataOutFile.fail())
    {
        cout <<"Error while trying to Create/Open your file '"<<endl;
        exit(-1);
    }
    ArrestDataOutFile<< encodedData <<endl;

    getline(newArrestDataInFile,outArrestData);



    cout<<"Input File data"<<endl;
    cout<<"---------------"<<endl;
    cout<<originalData<<endl;
    cout<<endl;
    cout<<"Output file data"<<endl;
    cout<<"---------------"<<endl;
    cout<<outArrestData<<endl;
    ArrestDataOutFile.close();
    newArrestDataInFile.close();

}
