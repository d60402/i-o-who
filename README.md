# I-O-Who

This project demonstrates the use of an [Auth0 Webtask](https://webtask.io) to integrate Google Home, IFTT, and MongoDB
for keeping track of [IOUs](https://en.wikipedia.org/wiki/IOU). Just say, "Hey Google. Create an IOU for Daryl for ten dollars", and a document is created in your MongoDB to record the person's name and the amount you owe them.

## Setting Everything Up

These instructions use the Webtask command line interface (CLI). Alternatively, you could adapt these instructions to use the [Webtask Code Editor](https://webtask.io/make). Before proceeding with the install, ensure you have Node.js and Node Package Manager (npm, included in in Node.js), which can be downloaded here: (https://nodejs.org/).

### Create Your Datbase And Database User

In order to create the Webtask, you'll need to provide a MongoDB URI which includes the login name and password for a MongoDB user that can write to the database. 
>Since the procedures for creating the database and user credentials vary slightly from hosting providers, the details for doing so are not included here. Once you have completed these steps, you should have a MongoDB URI such as `mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:23456/<dbname>`.

### Setup Your Webtask Development Environment

1. Install the Webtask CLI by executing the following terminal command...
    ```shell
    npm install wt-cli -g
    ```
2. Initialize Webtask by executing the following command. Follow the prompts to provide an e-mail address of phone number to receive an activation code...
    ```shell
    wt init
    ```

### Create The Webtask

1. Clone or download this github repository. Alternatively, you can simply create the `i-o-who.js` file manually since it's the only source code you need. 
    >This example code uses ES6 arrow functions, but you can of course use the ES5 "function" keyword instead if you prefer.

2. Create the Webtask on the webtask.io server by executing the following command. **Make sure you substitue your MongoDB URI obtained previously**...
    ```shell
    wt create --secret MONGO_URI=mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:23456/<dbname> i-o-who.js
    ```
3. Copy the URL that was output in the last step. It should be similar to `https://wt-xxxxxxxxxxxx.run.webtask.io/i-o-who`

### Create The IFTTT Applet

1. Login to ifttt.com.
2. Create a new Applet
3. For the **+this** part of the applet, choose the **Google Assistant service**.
4. For the trigger, choose the **Say a phrase with both a number and a text ingredient**
5. In the **What do you want to say?** field, enter **Create an IOU for $ for # dollars**. Optionally, you can provide other ways to say the phrase. Make sure the "$" is in the place where the user will speak the person's name (the text ingredient), and the "#" is in the place where the amount (the number ingredient) that is owed is spoken.'
6. In the **What do you want the Assistant to say in response?**, enter **Okay, I've added an IOU for $ for # dollars**, again making sure the "$" and "#" are included to respresent the name and amount respectively.
7. Click the **Create Trigger** button.
8. For the **+that** part of the applet, choose the **Maker Webhooks** service.
9. Click the **Make a web request** action.
10. In the action fields, paste the URL that was returned from the `wt create...` command that run previously, adding querystring parameters for the **name** and **amount** values. For example, `https://wt-xxxxxxxxxxxx.run.webtask.io/i-o-who?name={{TextField}}&amount={{NumberField}}`
11. Leave the **Method** field as **GET**, and the other fields blank.
12. Click the **Create action** button.
13. Click the **Finish** button.

### Try It Out!
Go to your Google Home, and say, "Hey Google, create an IOU for Daryl for ten dollars." If all goes according to plan, the Assistant will respond that it has created the IOU, and you see the corresponding documenent in your database!

### Troubleshooting

If things don't work out correctly, try adding `console.log()` statements to your Webtask script, recreate the Webtask on the server, then run `wt logs` on your local machine to watch log output.

One other thing I have found is that Google Home Assistant doesn't like certain phrases. For instance, I initially set the trigger phrase to, "I owe $ # dollars". However, Google Home responded that it didn't know how to help with that. I also tried, "Make a note that I owe $ # dollars", to which it responded, "Sorry, I can't take notes yet."

Another thing I have encountered is that the Google Assistant doesn't always recognize the phrase. For example, if I say, "Create an IOU for Daryl for ten dollars", it seems to consistently work fine. But if I change the amount, and say, "Create an IOU for Daryl for fifteen dollars", it usually responds that it doesn't know how to help with that. 
