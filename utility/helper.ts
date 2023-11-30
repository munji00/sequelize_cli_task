const bcrypt = require('bcrypt')
 const salt_value:number = 10;

 const hash_password = async(plain_password:string) => await bcrypt.hash(plain_password, salt_value);

 const compare_password=async(password:string, hash:string) => await bcrypt.compare(password, hash);

 module.exports ={
    hash_password,
    compare_password
 }
