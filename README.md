
# Implement an Alerting System for Monitoring Failed POST Requests











## Tech Stack

**Backend:** Node.js

**Database:** MongoDB

**Server:** Express.js

**Email Mechanism:** Google's SMTP server, Nodemailer

## Demo Video

- https://drive.google.com/file/d/168CpVN55Uq-lGv2jTSe_FKQQJ4jZj8h5/view?usp=sharing
## Run Locally

Clone the project

```bash
  git clone https://github.com/LuseBiswas/Assingment-Here.git
```

Go to the project directory

```bash
  cd Assingment-Here 
  cd backend
```

Install dependencies

```bash
  npm install
```

Generate .env by renaming sample.env

```bash
  PORT=5069
  MONGO_URI=Your_MongoDb_URI.mongodb.net/FlexiPe
  SMTP_EMAIL=your_email@gmail.com
  SMTP_PASSWORD=your_password_ftredulefxeqvmyj
  ALERT_EMAIL=receiver_email@gmail.com
  ```

Start the server

```bash
  npm run dev
```

