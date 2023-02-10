import "dotenv/config";
import Cors from "cors";
import Mysql from "mysql2";
import Express from "express";
import BodyParser from "body-parser";

class App {
  private mysql = Mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
  });

  private express = Express();

  private middlewares(): void {
    this.express.use(Cors());
    this.express.use(Express.json());
    this.express.use(BodyParser.json());
    this.express.use(BodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.express.post("/register", (req, res) => {
      this.mysql.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, result: any) => {
        if (result.length === 0) {
          this.mysql.query(
            `INSERT INTO users (name, email, password, phonenumber) VALUE ('${req.body.name}','${req.body.email}','${req.body.password}','${req.body.phonenumber}')`,
            () => {
              res.send({ message: "Usuário cadastrado com sucesso" });
            }
          );
        } else {
          console.log({ message: "Email já cadastrado" });
        }
      });
    });

    this.express.post("/login", (req, res) => {
      this.mysql.query(
        `SELECT * FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`,
        (err, result: any) => {
          if (result.length > 0) {
            res.send({message: "Logado!!!"});
          } else {
            console.log({message: "E-mail ou senha incorretos."});
          }
        }
      );
    });
  }

  private server(): void {
    this.express.listen(`${process.env.SV_PORT}`, () => {
      console.log(`✅ Servidor Aberto!!! | http://localhost:${process.env.SV_PORT}`);
    });
  }

  public method(): void {
    this.middlewares();
    this.routes();
    this.server();
  }
}

const app: App = new App();
app.method();
