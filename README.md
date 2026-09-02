# DevOps 2-Tier CI/CD Project with Jenkins, Docker and AWS EC2

## 📌 Project Overview

This project demonstrates a simple **2-Tier web application** deployed on an **AWS EC2 Ubuntu server** using **Docker, Docker Compose, GitHub, and Jenkins CI/CD**.

The application consists of:

* **Frontend:** HTML, CSS and JavaScript served using Nginx
* **Backend:** Node.js and Express
* **Database:** SQLite
* **Containerization:** Docker and Docker Compose
* **CI/CD:** Jenkins
* **Source Code Management:** Git and GitHub
* **Cloud Platform:** AWS EC2

### CI/CD Flow

```text
Developer
    |
    | git push
    v
GitHub
    |
    | Jenkins Pipeline
    v
Jenkins
    |
    | Docker Compose
    v
AWS EC2
    |
    +------------------+
    |                  |
    v                  v
Frontend            Backend
Nginx               Node.js
Port 80             Port 5000
                        |
                        v
                     SQLite
```

---

# 1. AWS EC2 Instance Creation

Create an EC2 instance from the AWS Console.

### Recommended Configuration

```text
AMI: Ubuntu Server 24.04 LTS
Instance Type: t2.small
Storage: 20 GB
```

Create or select a Key Pair for SSH access.

---

# 2. Configure EC2 Security Group

Add the following inbound rules:

| Type       | Port | Source    |
| ---------- | ---: | --------- |
| SSH        |   22 | My IP     |
| HTTP       |   80 | 0.0.0.0/0 |
| Custom TCP | 8080 | 0.0.0.0/0 |

Port 80 is used by the application.

Port 8080 is used by Jenkins.

Do not expose backend port 5000 publicly.

---

# 3. Connect to EC2

From Windows PowerShell:

```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

Example:

```bash
ssh -i "devops-key.pem" ubuntu@54.123.45.67
```

---

# 4. Update Ubuntu

```bash
sudo apt update
```

```bash
sudo apt upgrade -y
```

---

# 5. Create Swap Memory

Swap helps when available RAM becomes low.

```bash
sudo fallocate -l 2G /swapfile
```

```bash
sudo chmod 600 /swapfile
```

```bash
sudo mkswap /swapfile
```

```bash
sudo swapon /swapfile
```

Verify:

```bash
free -h
```

Make swap permanent:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

# 6. Install Git

```bash
sudo apt install git -y
```

Verify:

```bash
git --version
```

---

# 7. Install Docker

Install the required packages:

```bash
sudo apt update
```

```bash
sudo apt install ca-certificates curl -y
```

Create Docker keyring directory:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
```

Download Docker GPG key:

```bash
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```

Set permissions:

```bash
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add Docker repository:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Update package list:

```bash
sudo apt update
```

Install Docker:

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

Verify Docker:

```bash
docker --version
```

Verify Docker Compose:

```bash
docker compose version
```

Allow the Ubuntu user to use Docker:

```bash
sudo usermod -aG docker $USER
```

Exit the EC2 session:

```bash
exit
```

Connect again:

```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

Test:

```bash
docker ps
```

---

# 8. Install Java

Jenkins requires Java.

Install Java 21:

```bash
sudo apt update
```

```bash
sudo apt install fontconfig openjdk-21-jre -y
```

Verify:

```bash
java -version
```

---

# 9. Install Jenkins

Add the Jenkins repository key:

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
```

Add Jenkins repository:

```bash
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Update packages:

```bash
sudo apt update
```

Install Jenkins:

```bash
sudo apt install jenkins -y
```

Enable Jenkins:

```bash
sudo systemctl enable jenkins
```

Start Jenkins:

```bash
sudo systemctl start jenkins
```

Check Jenkins:

```bash
sudo systemctl status jenkins
```

Jenkins should show:

```text
active (running)
```

---

# 10. Open Jenkins

Open the following URL in your browser:

```text
http://YOUR_EC2_PUBLIC_IP:8080
```

Example:

```text
http://54.123.45.67:8080
```

Get the initial Jenkins password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy the password and paste it into the Jenkins setup page.

Select:

```text
Install suggested plugins
```

Create the Jenkins administrator account.

---

# 11. Give Jenkins Docker Permission

Jenkins needs permission to execute Docker commands.

Run:

```bash
sudo usermod -aG docker jenkins
```

Restart Jenkins:

```bash
sudo systemctl restart jenkins
```

Verify:

```bash
sudo -u jenkins docker ps
```

Jenkins should be able to access Docker.

---

# 12. Create Project Directory

Create the project directly on EC2:

```bash
cd ~
```

```bash
mkdir devops-2tier-cicd
```

```bash
cd devops-2tier-cicd
```

Create application folders:

```bash
mkdir frontend
```

```bash
mkdir backend
```

---

# 13. Project Structure

The final project structure is:

```text
devops-2tier-cicd/
│
├── Jenkinsfile
├── docker-compose.yml
├── nginx.conf
├── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── backend/
    ├── Dockerfile
    ├── package.json
    └── server.js
```

Create the required files using `nano`.

Example:

```bash
nano frontend/index.html
```

Save with:

```text
CTRL + O
Enter
CTRL + X
```

Create the remaining files in the same way.

---

# 14. Build and Run the Application

From the project directory:

```bash
cd ~/devops-2tier-cicd
```

Build and start the containers:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Test the backend:

```bash
curl http://localhost/api/health
```

Expected response:

```json
{
  "message": "Backend is working successfully!"
}
```

Open the application:

```text
http://YOUR_EC2_PUBLIC_IP
```

---

# 15. Create GitHub Repository

Create a new GitHub repository:

```text
devops-2tier-cicd
```

Use a public repository.

Do not create:

```text
README
.gitignore
License
```

during repository creation because these files already exist in the EC2 project.

---

# 16. Initialize Git

From the EC2 project directory:

```bash
cd ~/devops-2tier-cicd
```

Initialize Git:

```bash
git init
```

Add all files:

```bash
git add .
```

Check files:

```bash
git status
```

Create the first commit:

```bash
git commit -m "Initial DevOps Jenkins project"
```

Rename the branch to main:

```bash
git branch -M main
```

---

# 17. Connect Local Repository to GitHub

Add the GitHub remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/devops-2tier-cicd.git
```

Verify:

```bash
git remote -v
```

---

# 18. Push Project to GitHub

```bash
git push -u origin main
```

If GitHub asks for authentication while using HTTPS, use a GitHub Personal Access Token instead of your GitHub account password.

After successful push, refresh the GitHub repository and verify that all project files are present.

---

# 19. Create Jenkinsfile

Create the Jenkins Pipeline file:

```bash
nano Jenkinsfile
```

Add the following:

```groovy
pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Check Application') {
            steps {
                sh 'sleep 10'
                sh 'curl -f http://localhost/api/health'
            }
        }

    }

    post {

        success {
            echo 'Deployment successful!'
        }

        failure {
            echo 'Deployment failed!'
        }

    }
}
```

Save the file.

---

# 20. Push Jenkinsfile to GitHub

```bash
git add Jenkinsfile
```

```bash
git commit -m "Add Jenkins CI/CD pipeline"
```

```bash
git push
```

---

# 21. Create Jenkins Pipeline Job

Open Jenkins:

```text
Dashboard
    ↓
New Item
```

Enter:

```text
devops-2tier-cicd
```

Select:

```text
Pipeline
```

Click:

```text
OK
```

---

# 22. Configure Jenkins Pipeline

Under **Build Triggers**, select:

```text
GitHub hook trigger for GITScm polling
```

Under **Pipeline**:

```text
Definition:
Pipeline script from SCM
```

Select:

```text
SCM:
Git
```

Repository URL:

```text
https://github.com/YOUR_USERNAME/devops-2tier-cicd.git
```

Branch:

```text
*/main
```

Script Path:

```text
Jenkinsfile
```

Click:

```text
Save
```

---

# 23. Run Jenkins Build

Open:

```text
Jenkins
→ devops-2tier-cicd
```

Click:

```text
Build Now
```

Jenkins will execute the following stages:

```text
Checkout
    ↓
Get code from GitHub
    ↓
Build and Deploy
    ↓
Docker Compose
    ↓
Start application
    ↓
Check Application
    ↓
Health Check
```

If everything works correctly, Jenkins should show:

```text
Finished: SUCCESS
```

---

# 24. Test the Application

Open:

```text
http://YOUR_EC2_PUBLIC_IP
```

Click:

```text
Check Backend
```

Expected:

```text
Backend is working successfully!
```

---

# 25. Automatic CI/CD Test

Make a small change to the application.

For example:

```bash
nano frontend/index.html
```

Change the application title.

Then:

```bash
git add .
```

```bash
git commit -m "Update application"
```

```bash
git push
```

GitHub receives the new code.

The Jenkins webhook triggers the pipeline.

Jenkins then:

```text
GitHub
   ↓
Jenkins
   ↓
Checkout latest code
   ↓
Docker Compose Build
   ↓
Deploy
   ↓
Health Check
   ↓
SUCCESS
```

Refresh the application in the browser and verify the changes.

---

# 26. Useful Commands

### Check Jenkins

```bash
sudo systemctl status jenkins
```

Restart Jenkins:

```bash
sudo systemctl restart jenkins
```

### Check Docker

```bash
docker ps
```

### Check Docker Compose

```bash
docker compose ps
```

### View application logs

```bash
docker compose logs
```

Backend logs:

```bash
docker compose logs backend
```

Frontend logs:

```bash
docker compose logs frontend
```

### Restart application

```bash
docker compose up -d --build
```

### Stop application

```bash
docker compose down
```

### Check backend

```bash
curl http://localhost/api/health
```

### Git commands

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "your message"
```

```bash
git push
```

---

# 27. Final Architecture

```text
                     AWS CLOUD
                         |
                         v
                 ┌───────────────┐
                 │   EC2 Ubuntu  │
                 │    t2.small   │
                 └───────┬───────┘
                         |
             ┌───────────┴───────────┐
             |                       |
             v                       v
        ┌──────────┐           ┌──────────┐
        │ Jenkins  │           │  Docker  │
        │  :8080   │           │ Compose  │
        └────┬─────┘           └────┬─────┘
             |                      |
             |                ┌─────┴─────┐
             |                |           |
             |                v           v
             |           ┌────────┐  ┌─────────┐
             |           │ Nginx  │  │ Node.js │
             |           │ :80    │  │  :5000  │
             |           └────────┘  └────┬────┘
             |                            |
             |                            v
             |                         SQLite
             |
             ^
             |
          GitHub
             ^
             |
          git push
             ^
             |
         Developer
```

---

# 28. Technologies Used

* AWS EC2
* Ubuntu Linux
* Git
* GitHub
* Jenkins
* Jenkins Pipeline
* Docker
* Docker Compose
* Nginx
* Node.js
* Express.js
* SQLite
* HTML
* CSS
* JavaScript

---

# 29. Project Outcome

This project demonstrates a complete basic DevOps workflow:

```text
Code
 ↓
Git
 ↓
GitHub
 ↓
Jenkins
 ↓
CI/CD Pipeline
 ↓
Docker Build
 ↓
Docker Deployment
 ↓
AWS EC2
 ↓
Application
```

The main goal of this project is to demonstrate how source code can be automatically built, deployed, and tested on an AWS EC2 server using Jenkins and Docker.
