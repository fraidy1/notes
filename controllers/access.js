const db = require('../models')
const person=db.persons
const staff=db.staffes

exports.login=async(req, res) => {
    let a=await(person.findOne({where:{id_person:req.params.id}}))
    if (!req.params.id|| !req.params.password) 
     return res.status(400).json({ message: 'יש למלא את כל השדות'}) 
    else if(a==null)
     return res.status(400).json({message:'מספר זהות זה אינו מוכר במערכת. אנא נסה שנית'})
    else if(a&&!(req.params.password==a.password)) 
        return res.status(400).json({ message: 'סיסמא שגויה. אנא נסה שנית'})

    var statusPerson='3'
    if(await staff.findOne({where:{id_person_staff:req.params.id}}))
   {
        const a=await(staff.findOne({where:{id_person_staff:req.params.id}}))
        if(a.id_role=='1')
            statusPerson='1'
        else
            statusPerson='2'  
    }
    return res.status(201).send(statusPerson)
}


//async function login(req, res) {
    //     const { userId, userPassword } = req.body;
    
    //     try {
    //         const user = await User.findOne({ where: { userId } });
    
    //         if (!user) {
    //             // User with this email not found
    //             return res.status(401).json({ message: "Invalid id" });
    //         }
    
    //         const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
    
    //         if (!isPasswordValid) {
    //             // Incorrect password
    //             return res.status(401).json({ message: "Invalid password. Try again" });
    //         }
    //         // Generate and send JWT token
    //         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    //         res.json({ token });
    //     } 
    //     catch (err) {
    //         console.error(err);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // };