package numberOperationsSample;


//Class to hold attributes and methods of type Numbers
public class Numbers {

	private double number1;
	private double number2;
	
	public Numbers()
	{
		this.number1=0;
		this.number2=0;
	}
	//This is the constructor that initializes both numbers with their respective parameter values
	public Numbers(double number1,double number2)
	{
		this.number1=number1;
		this.number2=number2;
	}
	//This is the  accessor  that returns number1
	public double GetNumber1()
	{
		return number1;
		
	}
	//This is the  accessor  that returns number2
	public double GetNumber2()
	{
		return number2;
		
	}
	//This is the mutator that mutates both number1 and number2
	public void SetNumbers(double number1,double number2)
	{
		this.number1=number1;
		this.number2=number2;
	}
	//This is the mutator that mutates  number1 
	public void SetNumber1(double number1)
	{
		this.number1=number1;
	
	}
	//This is the mutator that mutates  number2 
	public void SetNumber2(double number2)
	{
		this.number2=number2;	
	}
	//this function ads two numbers and return their sum
	public  double Add()
	{
		return number1+number2;
	}
	//this function returns the difference between two numbers
	public  double Subtract()
	{
		return number1-number2;
	}
	//this function multiplies two numbers and returns their product
	public  double Multiply()
	{
		return number1*number1;
	}
	
	public  double Divide()
	{			
		return number1/number2;
	}
	//this function returns the squareroot of the sum of two numbers
	public  double Square()
	{
		return Math.sqrt(Add());
	}
}  
