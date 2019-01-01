---
layout: post
title: "Removing Java boilerplate code with Project Lombok"
description: "This article demonstrates how you can use Project Lombok library to remove boilerplate code from your Java projects."
date: "2018-12-24 08:30"
author:
  name: "Vladimir Fomene"
  url: "vladimirfomene"
  mail: "vladimirfomene@gmail.com"
  avatar: "https://twitter.com/vladimirfomene/profile_image?size=original"
related:
- 2017-11-15-an-example-of-all-possible-elements
---

**TL;DR:** In this article you will learn how to remove boilerplate code from
your Java projects. You will do so by using features of [Project Lombok](https://projectlombok.org/), a wonderful Java library which was created to help in this process. You will
learn how to use this library by developing an example per its feature. Last but not the least, you will learn how to incorporate this library in your [Spring Boot](https://spring.io/projects/spring-boot) projects.

## Prerequisites

To follow this article, you need to have the following tools installed on your system.

* JDK 8 or any version above.
* Any text editor or IDE of your choice, though I recommend IntelliJ.



## Why Use Project Lombok in your Java project

As you might already know from the opening paragraph, Project Lombok is a Java library. I guess the question you are probably asking yourself is, "Why will I be interested in
adding this extra dependency to my classpath?". According to the official Project Lombok site, this library will spice up your Java code by automating the creation of **accessor**,
**equals**, **hashcode**, **toString** methods, and even help you to implement the builder pattern on a class with just one annotation. By automating the creation of these methods
on your POJOs (Plain Old Java Objects), Project Lombok will reduce the time spent writing boilerplate code. I will also argue that it will also make your POJOs concise as it will remove the parts that are not really important to give more exposure to what makes
your POJOs really unique.


## How Project Lombok's features work

In order to use any of Project Lombok's features, you have to add annotations to your classes which specify which boilerplate code you want Project Lombok to implement for you. For example, say you have a class and you do not want to implement its `toString` method. All you have to do is add the `@ToString` at the top of your class and behind the scenes, Project Lombok will use the fields in your class to implement your `toString` method. This process is similar for all Project Lombok's features. With that covered, you are set to start experimenting with Project Lombok.

## Clone starter project and configure it with Project Lombok

* To start, clone [project-lombok-starter](https://github.com/vladimirfomene/project-lombok-starter) from GitHub.
* Import the project in your favorite IDE. You should not see anything when you
run this project because as of now, it does nothing. But you should run it to make sure it is bug free.
* Next, add Project Lombok to this project by adding the following line to your `build.gradle` file.

```gradle
//.... rest of file

dependencies {
	// ... don't remove the other dependencies ...
	compileOnly 'org.projectlombok:lombok:1.18.4'
}
```

* In IntelliJ IDEA, click on the *File* menu and select the *Settings* option. When the Setting window appears, select *Plugins* on the left pane of the window. Type *lombok plugin* in the search box of the window that appears. Select the *Lombok Plugin* once it appears in the search results. Your settings window should now look like the following:

![Lombok Plugin](./lombok-plugin.png)

Click on *Install* at the top right corner of the window, then click on the *Apply* button and finally click on *OK*. After clicking on *OK*, you will be asked if you want to restart the IDE. You should agree so that the IDE has time to configure itself with Project Lombok.


* Once your IDE starts, open the Settings window by clicking on the *File* menu and selecting the *Settings* option. In the *Settings* window, select Build, Execution, Deployment -> Compiler -> "Annotation Processors" then enable annotation processing on the window that appears. Once you enable annotation processing the window will look like this:

![Enable Annotation Processing](./annotation-processors.png)

Click on *Apply* to apply the new changes and then click on *OK* to finish the configuration.

## Project Lombok Features

### Accessor Annotations

Project Lombok's *@Getter* and *@Setter* annotations automates the generation of getters and setters for non-static fields of your POJOs. If you have a field named `length`, the @setter annotation will create a method called `setLength` which returns void and takes one parameter with the same type as that of the field. The @Getter annotation on the otherhand will create a `getLength` method which return the same type as `length`. If `length` is a boolean, it will instead generate `isLength` as the getter. If you place these annotations on a class field, Project Lombok will automagically generate the accessor methods for you. If these annotations are placed on the class, Project Lombok will create accessor methods for all non-static fields of the class. You can also control the access level of the methods generated by passing `AccessLevel.PROTECTED`, `AccessLevel.PUBLIC`, `AccessLevel.PRIVATE`, `AccessLevel.PACKAGE` as argument to the accessor annotations. For example, using `@Setter(AccessLevel.PROTECTED)` will create a protected setter method.

With the theory covered, now is the time to put all these to practice. Imagine you have an app and you want to create a POJO for your app users. To do that go ahead and create a package called `Accessor` in the `src/main/java` directory of the project. Once the package is created, go inside and create a `VanillaAppUser.java` file, then add the following code to it.

```java
package Accessor;

public class VanillaAppUser {

    private String username;

    private String password;

    public VanillaAppUser(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

Now, use Project Lombok's annotations to automagically generate the getters and setters above for you. After refactoring, the above class will look as follows:

```java
package Accessor;

import lombok.Getter;
import lombok.Setter;

public class LombokAppUser {

    @Setter @Getter
    private String username;

    @Setter @Getter
    private String password;

    public LombokAppUser(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
```
Add the above class to your `Accessor` package in a `LombokAppUser.java` file. You see how using these Project Lombok's annotations have dramatically reduced the amount of code in this file. The above class is the equivalent of the `VanillaAppUser` class except that Project Lombok will generate the getters and setters for you because of the annotation on the `username` and `password` fields.

To test both classes for the same functionality, add the `testAccessor` method below to your `src/main/java/TestLombok` class and call it in the main method.

```java
public static void testAccessor(){
    VanillaAppUser vanillaAppUser = new VanillaAppUser("exampleuser", "password");
    LombokAppUser lombokAppUser = new LombokAppUser("exampleuser", "password");

    System.out.println("Username: " + vanillaAppUser.getUsername() + ", " + "Password: " + vanillaAppUser.getPassword());
    System.out.println("Username: " + lombokAppUser.getUsername() + ", " + "Password: " + lombokAppUser.getPassword());
}
```

After running the program, you should see the same username and password printed in the console for both classes, which confirms that these classes do the same thing though they have different names.

### Builder Annotation

Apart from helping you generate accessor methods, Project Lombok can also help you implement the builder design pattern. As an example, create a Course POJO that implements the builder pattern. Start by creating a `Builder` package in `src/main/java`, then create a file called `VanillaCourse.java` and add the following code to it.

```java
package Builder;

public class VanillaCourse {

    private String courseName;

    private String courseCode;

    public VanillaCourse(String courseName, String courseCode){
        this.courseCode = courseCode;
        this.courseName = courseName;
    }

    public static VanillaCourseBuilder builder() {
        return new VanillaCourseBuilder();
    }

    public static class VanillaCourseBuilder{

        private String courseName;

        private String courseCode;

        public VanillaCourseBuilder courseName(String courseName){
            this.courseName = courseName;
            return this;
        }

        public VanillaCourseBuilder courseCode(String courseCode){
            this.courseCode = courseCode;
            return this;
        }

        public VanillaCourse build(){
            return new VanillaCourse(courseName, courseCode);
        }

    }

    @Override
    public String toString() {
        return "VanillaCourse{" +
                "courseName='" + courseName + '\'' +
                ", courseCode='" + courseCode + '\'' +
                '}';
    }
}
```

This class uses the inner `VanillaCourseBuilder` class to implement the builder pattern. To implement the same Course POJO with Project Lombok, create a file called `LombokCourse.java` in the same package and add the following code to it.

```java
package Builder;

import lombok.Builder;

@Builder
public class LombokCourse {

    private String courseName;

    private String courseCode;

    @Override
    public String toString() {
        return "LombokCourse{" +
                "courseName='" + courseName + '\'' +
                ", courseCode='" + courseCode + '\'' +
                '}';
    }
}
```

With just the @Builder annotation, Project Lombok will
implement the builder pattern for this POJO.

To test these implementations, add the `testBuilder` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testBuilder` method in the main method. Here is the code for the `testBuilder` method:

```java
public static void testBuilder(){
    VanillaCourse vanillaCourse = VanillaCourse.builder().courseName("Intro to CS").courseCode("cs50").build();

    LombokCourse lombokCourse = LombokCourse.builder().courseName("Intro to CS").courseCode("cs50").build();

    System.out.println(vanillaCourse.toString());
    System.out.println(lombokCourse.toString());
}
```

After you run this method you should see that the attributes for `VanillaCourse` and `LombokCourse` objects are the same which proves that Project Lombok built the same POJO as the plain Java class.

### Val Functionality

val is a feature that is used when declaring local variables or in foreach loops. In these two contexts, it serves as the type of the variable and makes it final. As an example, you will create a user class that can create users and log them to the console. For starters, create a `val` package in `src/main/java`, then create a `VanillaUser.java` file in this package and add the following code to it.

```java
package val;

import java.util.ArrayList;
import java.util.List;

public class VanillaUser {

    public List<String> createUsers(){
        List<String> users = new ArrayList<String>();

        users.add("vladimir");
        users.add("fomene");
        users.add("bruno");
        users.add("krebs");

        return users;

    }

    public void logUsers(List<String> users){

        for(String user: users){
            System.out.println("I'm " + user);
        }

    }
}
```

To use Project Lombok, replace the type of the *users* local variable in the `createUsers` method with *val* and in `logUsers` replace the String type in the foreach loop by *val*. The result should look like the following:

```java
package val;

import lombok.val;

import java.util.ArrayList;
import java.util.List;

public class LombokUser {

    public List<String> createUsers(){
        val users = new ArrayList<String>();

        users.add("vladimir");
        users.add("fomene");
        users.add("bruno");
        users.add("krebs");

        return users;

    }

    public void logUsers(List<String> users){

        for(val user: users){
            System.out.println("I'm " + user);
        }

    }
}
```

Now, create a `LombokUser.java` file in your `val` package and add the above code to it.

To test these implementations, add the `testVal` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testVal` method in the main method. Here is the code for the `testVal` method:

```java
public static void testVal(){

        LombokUser lombokUser = new LombokUser();
        VanillaUser vanillaUser = new VanillaUser();
        List<String> vanillaUsers = vanillaUser.createUsers();
        List<String> lombokUsers = lombokUser.createUsers();

        System.out.println("Here is list 1 .....");
        vanillaUser.logUsers(vanillaUsers);

        System.out.println("Here is list 2 .....");
        lombokUser.logUsers(lombokUsers);
}
```

If you run your application, you will see that the list produced by `LombokUser` is identical to the list produced by `VanillaUser`.

### Var Functionality

The *var* feature is a cousin to the *val* feature. They are identical in functionality except for the fact that *var* does not make variable final. To demonstrate the utility of this feature create a `var` package in the `src/main/java` directory, and then create a `VanillaMath.java` file in it. To this file, add the following class which stores a list of operators, logs them and can also perform addition operations.

```java
package var;

import java.util.HashMap;
import java.util.Map;

public class VanillaMath {


    public int add(int a, int b){
        int sum = a + b;

        return sum;
    }

    public HashMap<String, Character> addOperators(){
        HashMap<String, Character> operators = new HashMap<String, Character>();

        operators.put("add", '+');
        operators.put("subtract", '-');
        operators.put("divide", '/');
        operators.put("multiply", '*');

        return operators;
    }

    public void logOperators(HashMap<String, Character> operators){

        for(Map.Entry<String, Character> entry: operators.entrySet()){
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

By replacing all the local variables' type with *var*, we will have the following result:

```java
package var;

import lombok.var;

import java.util.HashMap;

public class LombokMath {

    public int add(int a, int b){
        var sum = a + b;

        return sum;
    }

    public HashMap<String, Character> addOperators(){
        var operators = new HashMap<String, Character>();

        operators.put("add", '+');
        operators.put("subtract", '-');
        operators.put("divide", '/');
        operators.put("multiply", '*');

        return operators;
    }

    public void logOperators(HashMap<String, Character> operators){

        for(var entry: operators.entrySet()){
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

Create a `LombokMath` class in your `var` package and add the above code to it.

To test these implementations, add the `testVar` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testVar` method in main. Here is the code for the `testVar` method:

```java
public static void testVar(){

        LombokMath lombokMath = new LombokMath();
        VanillaMath vanillaMath = new VanillaMath();

        System.out.println("Here are the vanilla operations: ");

        int vanillaSum = vanillaMath.add(2018, 1);
        System.out.println("The sum is " + vanillaSum);
        HashMap<String, Character> vanillaOperators = vanillaMath.addOperators();
        vanillaMath.logOperators(vanillaOperators);

        System.out.println("Here are the lombok operations: ");

        int lombokSum = lombokMath.add(2018, 1);
        System.out.println("The sum is " + lombokSum);
        HashMap<String, Character> lombokOperators = vanillaMath.addOperators();
        vanillaMath.logOperators(lombokOperators);
}
```

If you now run the application, you will realize that both implementations produce the same result. Therefore, our two implementations are exactly the same.

### Cleanup Annotation

Prepending any resource variable like a `FileInputStream` with @Cleanup will tell Project Lombok to automatically close this resource once it is no longer in use in the current scope. Note that as of Java 7.0, there is a special try statement that automatically does resource management for you. To demonstrate how to use this annotation, you will create a class that reads from an input file and write to an output file. Start by creating an `input.txt` in the root directory of the project-lombok-starter project. Fill this file with any text of your choice. Next, create a `cleanup` package in `src/main/java`. Create a file called `VanillaIO.java` in this package and fill it with the following code:

```Java
package Cleanup;

import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * This is example is an adaption of the example on the lombok site
 * (https://projectlombok.org/features/Cleanup)
 */
public class VanillaIO {

    public VanillaIO() throws IOException {

        InputStream in = null;

        try{
            in = new FileInputStream("input.txt");
            OutputStream out = null;
            try{

                out = new FileOutputStream("output.txt");
                byte[] b = new byte[10000];
                while (true) {
                    int r = in.read(b);
                    if (r == -1) break;
                    out.write(b, 0, r);
                }
            } finally {
                out.close();
            }
        }finally {
            in.close();
        }

    }
}
```

To implement this class with Project Lombok you have to prepend your resource variable with @Cleanup. Add a `LombokIO.java` file in your `cleanup` package and fill it with the following code:

```java  

import lombok.Cleanup;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * This is example is an adaption of the example on the lombok site
 * (https://projectlombok.org/features/Cleanup)
 */
public class LombokIO {

    public LombokIO() throws IOException {

        @Cleanup InputStream in = new FileInputStream("input.txt");
        @Cleanup OutputStream out = new FileOutputStream("output.txt");
        byte[] b = new byte[10000];
        while (true) {
            int r = in.read(b);
            if (r == -1) break;
            out.write(b, 0, r);
        }
    }
}
```

Notice how this annotation reduces the code to a few lines of code and makes it cleaner.

To test these implementations, add the `testCleanup` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testCleanup` method in main. Here is the code for the `testCleanup` method:

```java

public static void testCleanup(){

       try{
           VanillaIO vanillaIO = new VanillaIO();
           //LombokIO lombokIO = new LombokIO();
       }catch(IOException ex){
           ex.printStackTrace();
       }

}
```
First run your app with the `VanillaIO` and check your output.txt file. Then comment out the `VanillaIO` object and uncomment the `LombokIO` object line. Run your application again and you should get the same result as before.

### ToString Annotation

Project Lombok's @ToString annotation will save you from writing `toString` methods for your POJOs. To test this functionality, create a `ToString` package in `src/main/java`, then create a `VanillaPerson.java` file in this package and fill it with the following code:

```Java
package ToString;

public class VanillaPerson {

    private String firstName;

    private String lastName;

    public VanillaPerson(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return "VanillaPerson{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}
```

To implement the same class with Project Lombok, create `LombokPerson.java` file in the `ToString` package and fill it with the following code:

```java
package ToString;

import lombok.ToString;

@ToString
public class LombokPerson {

    private String firstName;

    private String lastName;

    public LombokPerson(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }


}
```

As usual, adding the annotation saves you from writing extra lines of code.

To test these implementations, add the `testToString` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testToString` method in main. Here is the code for the `testToString` method:

```Java
public static void testToString(){

       LombokPerson lombokPerson = new LombokPerson("vladimir", "fomene");
       VanillaPerson vanillaPerson = new VanillaPerson("vladimir", "fomene");

       //lombok version
       System.out.println(lombokPerson.toString());

       //Vanilla version
       System.out.println(vanillaPerson.toString());
}
```

When you run your program, the output from the vanilla Java `toString` should be identical to that of Project Lombok.


### EqualsAndHashCode Annotation

The @EqualsAndHashCode annotation generates an `equals` and `hashcode` implementation of your POJOs. To experiment with this feature, create a `EqualsAndHashCode` package in `src/main/java`. In this package, create a `VanillaLecture.java` file and fill it with the following code. This class contains an implementation of the `equals` and `hashcode` methods.

```Java
package EqualsAndHashCode;

import java.util.Objects;

public class VanillaLecture {

    private String lectureName;

    private String lectureCode;

    public VanillaLecture(String lectureName, String lectureCode) {
        this.lectureName = lectureName;
        this.lectureCode = lectureCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VanillaLecture that = (VanillaLecture) o;
        return Objects.equals(lectureName, that.lectureName) &&
                Objects.equals(lectureCode, that.lectureCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lectureName, lectureCode);
    }
}
```

To use the @EqualsAndHashCode annotation, create `LombokLecture.java` file in the `EqualsAndHashCode` package and fill it with the following code:

```Java
package EqualsAndHashCode;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class LombokLecture {

    private String lectureName;

    private String lectureCode;

    public LombokLecture(String lectureName, String lectureCode) {
        this.lectureName = lectureName;
        this.lectureCode = lectureCode;
    }
}
```

Notice how the `equals` and `hashcode` does not appear in this version.

To test these implementations, add the `testEqualsAndHashCode` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testEqualsAndHashCode` method in main. Here is the code for the `testEqualsAndHashCode` method:

```Java
public static void testEqualsAndHashCode(){

        VanillaLecture vanillaLecture = new VanillaLecture("Intro to Computer Science", "cs50");
        LombokLecture lombokLecture = new LombokLecture("Operating Systems", "cs121");

        System.out.println(vanillaLecture.hashCode());
        System.out.println("Are these two objects equals?" + vanillaLecture.equals(lombokLecture));

        System.out.println(lombokLecture.hashCode());
        System.out.println("Are these two objects equals?" + lombokLecture.equals(vanillaLecture));

}
```

Run your application and you should see your two implementations print their hashcodes and also the result of comparing objects using their `equals` methods.

### NonNull Annotation

When the @NonNull annotation is placed before a method parameter, it means that method will not accept `null` as an argument. If you pass it a null object, it will raise a `NullPointerException`.

To use this functionality, create a `NonNull` package in `src/main/java` directory. Next, create a `VanillaClient.java` file in this package and fill it with the following code:

```java
package NonNull;

public class VanillaClient {

    private String clientName;

    private String clientTel;


    public VanillaClient(String clientName, String clientTel) {

        if (clientName == null) {
            throw new NullPointerException("ClientName cannot be null");
        }

        this.clientName = clientName;
        this.clientTel = clientTel;
    }
}
```

Notice the check that the above class constructor does on the `clientName` parameter. We can do that check using the @NonNull annotation. To start, create a `LombokClient.java` file in the `NonNull` package and then fill it with the following code:

```java
package NonNull;

import lombok.NonNull;

public class LombokClient {

    private String clientName;

    private String clientTel;


    public LombokClient(@NonNull String clientName, String clientTel) {

        this.clientName = clientName;
        this.clientTel = clientTel;
    }
}
```

To test these implementations, add the `testNonNull` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testNonNull` method in main. Here is the code for the `testNonNull` method:

```java
public static void testNonNull(){

       //VanillaClient vanillaClient = new VanillaClient(null, "+237xxxxxxxxx");
       LombokClient lombokClient = new LombokClient(null, "+237xxxxxxxxx");
}
```

When you first run your application, you will see that it throws a `NullPointerException` because you passed a null object. If you comment the `LombokClient` line and uncomment the `VanillaClient` line, then run your program again you will notice that it still throws a `NullPointerException` exception. Therefore the Project Lombok version of the implementation does exactly what the vanilla Java version does.

### Constructor Annotation

The @NoArgsConstructor annotations generates a constructor with no parameter and the @AllArgsConstructor generates a constructor with one parameter per class field. To learn how to use these annotations we will create a customer POJO. To start, create a `constructor` package in the `src/main/java` directory. Then create a `VanillaCustomer.java` file and fill it with the following code:

```Java
package Constructor;

public class VanillaCustomer {

    public String name;

    public String tel;

    public String gender;


    public VanillaCustomer(String name, String tel, String gender){
        this.name = name;
        this.tel = tel;
        this.gender = gender;
    }

    public VanillaCustomer(){

    }

    @Override
    public String toString() {
        return "VanillaCustomer{" +
                "name='" + name + '\'' +
                ", tel='" + tel + '\'' +
                ", gender='" + gender + '\'' +
                '}';
    }
}
```

You should replace all the methods in the above class with annotations. To do this create `LombokCustomer.java` in the `constructor` package and fill it with the following code:

```java
package Constructor;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor @AllArgsConstructor @ToString
public class LombokCustomer {

    public String name;

    public String tel;

    public String gender;
}
```

To test these implementations, add the `testConstructor` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testConstructor` method in main. Here is the code for the `testConstructor` method:

```Java
public static void testConstructor(){

        VanillaCustomer vanillaCustomer = new VanillaCustomer("Vladimir Fomene", "+237xxxxxxxxx", "male");
        LombokCustomer lombokCustomer = new LombokCustomer("Vladimir Fomene", "+237xxxxxxxxx", "male");

        //vanilla version
        System.out.println(vanillaCustomer.toString());

        //lombok version
        System.out.println(lombokCustomer.toString());
}
```

If you run your application, you will notice that both implementations will print the same thing. Therefore Project Lombok implementation is same with the vanilla Java implementation.

### Data Annotation

The @Data annotation combines the implementations of the @ToString, @EqualsAndHashCode, @Getter / @Setter and @RequiredArgsConstructor annotations. To use this annotation, create a `Data` package, and create `User.java` file in this package. Fill this file with the following code:


```java
package Data;

import lombok.Data;
import lombok.NonNull;

@Data
public class User {

    @NonNull
    private String username;

    @NonNull
    private String password;
}
```

To test these implementations, add the `testData` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testData` method in main. Here is the code for the `testData` method:


```Java
public static void testData(){

        User user = new User("exampleuser", "password");

        System.out.println(user.hashCode());
        System.out.println("Are these two objects equals?" + user.equals(user));

        System.out.println(user.toString());

        System.out.println("User: " + user.getUsername() + ", " + "password: " + user.getPassword());

        user.setPassword("xxxxxxxxxxxxxxx");
        user.setUsername("newUsername");

        System.out.println("User: " + user.getUsername() + ", " + "password: " + user.getPassword());


}
```

After running your application, you should see the result of calling your hashcode, equals, toString, getters and setters.

### Log Annotation

The @Log annotation reduces the machinery needed to setup logging in your POJOs. To learn how this annotation works, start by creating a `Log` package in `src/main/java`. Then we will use vanilla Java to implement logging in `VanillaLog.java`. Create this file and add it to the `Log` package. For the logging demonstration, add the following code to `VanillaLog.java`.

```Java
package Log;

import java.util.logging.Logger;

public class VanillaLog {

    private static final Logger log = java.util.logging.Logger.getLogger(VanillaLog.class.getName());

    public void log(){
        log.info("Your Christmas gift is coming.");
    }
}
```

With the @Log annotation you can get rid of the import and declaring a variable for the logger. To do that create a `LombokLog.java` in the `Log` package. Add the following code to this file:

```java  
package Log;

import lombok.extern.java.Log;

@Log
public class LombokLog {

    public void log(){
        log.info("Your Christmas gift is coming.");
    }

}
```

Notice how with Project Lombok all you have to do is add the @Log annotation to your classes.

To test the above implementations, add the `testLog` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testLog` method in main. Here is the code for `testLog`:

```java
public static void testLog(){

        VanillaLog vanillaLog = new VanillaLog();
        LombokLog lombokLog = new LombokLog();

        //vanilla version
        vanillaLog.log();

        //lombok version
        lombokLog.log();
}
```
Notice how when you run the app, both implementations produce the same result to show that the implementations are equivalent.


### Value Annotation

According to Project Lombok's documentation, @Value is a variant for @Data except that it makes all the fields private and final. It also does not generate setters. To demonstrate how this annotation works, create a `Value` package in `src/main/java`. Then create a `VanillaStudent.java` POJO in ths package. The code for this file should look like so:


```java  
package Value;

import java.util.Objects;

public final class VanillaStudent {

    private final String studentName = "student";

    private final String studentID = "36272018";

    public String getStudentName() {
        return studentName;
    }

    public String getStudentID() {
        return studentID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VanillaStudent that = (VanillaStudent) o;
        return Objects.equals(studentName, that.studentName) &&
                Objects.equals(studentID, that.studentID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentName, studentID);
    }
}
```

Notice how the fields of the class are private and final. The class itself is also final. Now to get rid of all the boilerplate code, create `LombokStudent.java` in the `Value` package and fill it with the following code:

```java
package Value;

import lombok.Value;

@Value
public class LombokStudent {

    private final String studentName = "student";

    private final String studentID = "36272018";
}
```

This one annotation replaces all the method implementations in `VanillaStudent.java`.


To test the above implementations, add the `testValue` method to the `src/main/java/TestLombok` class, then comment out all the other methods calls in `TestLombok`'s main class and finally place a call to your `testValue` method in main. Here is the code for `testValue`:

```java
public static void testValue(){
        VanillaStudent vanillaStudent = new VanillaStudent();

        System.out.println("Student Name: " + vanillaStudent.getStudentName() + ", " + "Student Id: " + vanillaStudent.getStudentID());
        System.out.println(vanillaStudent.hashCode());
        System.out.println("Are these two objects equals?" + vanillaStudent.equals(vanillaStudent));

        LombokStudent lombokStudent = new LombokStudent();
        System.out.println("Student Name: " + lombokStudent.getStudentName() + ", " + "Student Id: " + lombokStudent.getStudentID());
        System.out.println(lombokStudent.hashCode());
        System.out.println("Are these two objects equals?" + lombokStudent.equals(lombokStudent));
}
```

When you run the app, your two implementations should produce the same result.

## Adding Project Lombok to a Spring Boot project.

The team behind Spring Boot has added Project Lombok as one of their dependencies. If you are creating a Spring Boot project and you will like to add Project Lombok to it. Head to the [Spring Initializr](https://start.spring.io/) page to create a new Spring Boot project. While filling your application's requirement on the page, search for *Lombok* in the dependency section of the page and select the first option that appears.

![start-spring-io](./start-spring-io.png)

With that in place, you can now download your project, it will have Project Lombok included in your build system's dependencies.


## Conclusion

In this article you learned how to use Project Lombok's annotations to remove boilerplate code from your project. To learn how to use each annotation, you first created a vanilla Java version of the example and then, refactored it using Project Lombok's annotations. Although this article exposed you to most of Project Lombok's annotations, there is still more to learn like adding options to your annotations. To learn more, you can read from [Project Lombok's documentation](https://projectlombok.org/features/all)
