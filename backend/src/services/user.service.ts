import { Repository, MoreThan } from "typeorm";
import User from "../entities/user.entity";
import dbConn from "../database/postgresConnection";
import { createTransport, SentMessageInfo } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { randomBytes } from "crypto";
import { hostname } from "os";


class UserService{
    userRepository: Repository<User>

    constructor(){
        this.userRepository = dbConn.getRepository(User)
    }

    async insertUser(name: string, login: string, email: string, password: string, birthday: Date) : Promise<User>{
        let user = new User()

        if(password.length < 6){
            throw new Error("Sua senha deve conter pelo menos 6 caracteres")
        }

        let loginexists = await this.userRepository.findOne({where:{login:login}})
        if(loginexists){
            throw new Error("Já existe cadastro com esse login")
        }
        let emailexists = await this.userRepository.findOne({where:{email:email}})
        if(emailexists){
            throw new Error("Já existe cadastro com esse e-mail")
        }

        user.name = name
        user.login = login
        user.email = email
        user.password = password
        user.birthday = birthday

        return await this.userRepository.save(user)
    }

    async getUserByLogin(login: string) : Promise<User>{
        let user = await this.userRepository.findOne({where:{login:login}})
        if(!user){
            throw new Error("user not found")
        }

        return user
    }

    async deleteUser(login: string) : Promise<User>{
        let user = await this.userRepository.findOne({where:{login:login}})
        if(!user){
            throw new Error("user not found!")
        }
        await this.userRepository.delete(user.userID)

        return user
    }

    async updateUser(login : string, newname: string, newlogin: string, newpassword: string, newbirthday: Date) : Promise<User> {
        let user = await this.userRepository.findOne({where:{login:login}})
        if(!user){
            throw new Error("user not found")
        }
        if(newname != null) { user.name = newname }
        if(newlogin != null) { user.login = newlogin }
        if(newpassword != null) { 
            if(newpassword.length < 6){
                throw new Error("Sua senha deve conter pelo menos 6 caracteres")
            }
            user.password = newpassword 
        }
        if(newbirthday != null) { user.birthday = newbirthday }

        return await this.userRepository.save(user)
    }

    async recoverUser(email: string) : Promise<SMTPTransport.SentMessageInfo> {
        let user = await this.userRepository.findOne({where:{email:email}})
        if(!user){
            throw new Error("user not found")
        }

        let token = randomBytes(20).toString('hex');

        user.recoverytoken = token;
        user.recoveryexpire = Date.now() + 300000; // 5 minutos

        await this.userRepository.save(user)

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Recuperação de conta",
            html: "<p>Clique <a href=" + "http://" + hostname() + ":" + process.env.PORT + "/users/recovery/" + token + ">aqui</a> para realizar a mudança de senha</p>"
        }

        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        })
        
        let emailsent = await transporter.sendMail(mailOptions)

        return emailsent
    }

    async changePassword(token: string, password: string, confirm: string) : Promise<User> {
        let user = await this.userRepository.findOne({where:{recoverytoken: token, recoveryexpire: MoreThan(Date.now())}})
        if(!user){
            throw new Error("Token de recuperação inválido ou expirado")
        }
        if(password != confirm){
            throw new Error("Senhas não correspondem")
        }
        if(password.length < 6){
            throw new Error("Sua senha deve conter pelo menos 6 caracteres")
        }
        if(password == user.password){
            throw new Error("A senha não pode ser igual à anterior")
        }
        user.password = password;
        user.recoverytoken = null;
        user.recoveryexpire = null;

        return await this.userRepository.save(user)
    }
}

export default UserService