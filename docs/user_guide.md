# Dynamic Workflow
Dynamic Workflow built on top of express using Adobe Sign API.

![image](https://user-images.githubusercontent.com/33329695/71855049-d8464b80-3094-11ea-94db-88a0fc492723.png)

## Table of Contents
- [1. General Information](#1.-general-information)
  - [1.1 About Dynamic Workflow](#1.1-about-dynamic-workflow)
    - [1.1.1 What Can Dynamic Workflow Do?](#1.1.1-what-can-dynamic-workflow-do-?)
  - [1.2 System Requirements](#1.2-system-requirements)
- [2. Getting Started](#2.-getting-started)
  - [2.1 Working with Dynamic Workflow](#2.1-working-with-dynamic-workflow)
  - [2.2 Submitting the Workflow](#2.2-submitting-the-workflow)
  - [2.3 Features](#2.3-features)

## 1. General Information
### 1.1 About Dynamic Workflow
Dynamic workflows allow users to specify the next participants within an agreement.
#### 1.1.1 What Can Dynamic Workflow Do?
- Allow users to run workflows on a local server
- Mirrors workflow on Adobe Sign
- Allow users to be able to use workflow without logging into Adobe Sign
### 1.2 System Requirements
In order to have Dynamic Workflow working successfully, please make sure you have installed the following:
- Install Node.js
- Install Node Packaging Manager
- Install all dependencies from Dynamic Workflow

## 2. Getting Started
### 2.1 Working with Dynamic Workflow
The user interface for Dynamic Workflow consists of a main window with a list of workflows to select from, created by your Adobe Sign account.

![image](https://user-images.githubusercontent.com/33329695/71855701-a3d38f00-3096-11ea-8f77-32877540c0c4.png)

Click the **Select** button to open the workflow you want to select in the drop-down menu.

### 2.2 Submitting the Workflow
Once you have opened your selected workflow, there are some key areas to check and fill before submitting your workflow.

![image](https://user-images.githubusercontent.com/33329695/71854905-68d05c00-3094-11ea-87ab-d05d86000ac2.png)

Make sure you are on the right workflow by checking for the name of the workflow on the top at **Step 1**.

![image](https://user-images.githubusercontent.com/33329695/71854959-90272900-3094-11ea-961f-7e76846023f1.png)

Once you are in the right workflow, proceed to check or fill each step fields before submitting your workflow.

1. Instruction for sender should be edited appropriately in Adobe Sign.
- You can only edit the instruction text in Adobe Sign not in Dynamic Workflow.
2. Fill in Recipient’s Email if it is not prefilled already.
- Prefilled Recipient fields are indicated with blue.
3. Check and edit Document Name and Messages if needed.
4.	Upload a file from the location your file is stored by clicking the **Browse** button.
- Select the file and click the **Open** button.
- If the file is pre-uploaded, proceed to the next step.
5.	Click the **Submit** button to send the workflow to the recipient’s email.

After submitting the workflow, the recipient will receive an email for a signature request.

### 2.3 Features
Other features you can add-on to the default workflow are shown below.

![image](https://user-images.githubusercontent.com/33329695/71854974-96b5a080-3094-11ea-93ec-b311fad31afa.png)

1.	In the **CC** section, add CC’s email(s) and the workflow will be sent to the email(s).
- Prefilled CC’s email(s) is indicated by blue.
2.	In the **Fields** section, the input text box will be merged into the selected document.
3.	For added protection to the workflow, check the **Password Required** checkbox.
- Create a password and confirm password. Password must contain 1 to 32 characters.
- Click the **Show Password** button to see your passwords.
4.	Check **Completion Deadline** checkbox to have a deadline for the signer up to 180 days when the workflow was created.
- Enter a complete deadline date.
- Or select complete deadline date from drop-down calendar.
5.	Check **Set Reminder** checkbox for how frequently to remind the signer for a signature.
- Select an option from the drop-down menu.
