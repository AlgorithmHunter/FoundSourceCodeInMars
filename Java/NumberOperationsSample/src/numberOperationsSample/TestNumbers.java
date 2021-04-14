package numberOperationsSample;

import java.util.Scanner;
//Description-This application simple takes two numbers and output their different calculations
//(Addition,Squareroot,product,difference etc)
//Author-Algorithm Hunter
//Copyrights-No Copyrights
//Last Update - 24/02/2021

public class TestNumbers {

	public static void main(String[] args) {
		
		System.out.println("This java console application receives two numbers" +"\n and output their difference, product, sum, and division \n" +
		"-------------------------------------------------------------------\n");
		//Get numbers from user input device
		Scanner input =new Scanner(System.in);
		System.out.println("Input your first degit here:");
		double number1=input.nextDouble();		
		System.out.println("Input your second degit here:");
		double number2=input.nextDouble();
		
		System.out.println("");
		
		//Instantiate Numbers or create an instanceof Numbers
	    Numbers MyNumbers=new Numbers(number1,number2);
	    
	    ///print operation results
        System.out.println( "The sum of your numbers is: " + MyNumbers.Add() +"\n"+
	   "The product of two numbers is:"+MyNumbers.Multiply() +"\n"+ "The difference of the two numbers is: "+ MyNumbers.Subtract() 
	   );
        System.out.printf("The division of two numbers is: %4.2f\n",MyNumbers.Divide());
      
        System.out.printf("The squareroot of the sum of two numbers is: %4.2f",MyNumbers.Square());
        //dispose input
      input.close();    
	}

}
