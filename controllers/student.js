const { where } = require('sequelize');
const db = require('../models');
const person = db.persons
const student = db.students
const banks = db.banks

var { cr } = require('../dal/createObj ');

exports.findAll = async (req, res) => {
  let p = {};
  cr(p, "$first_name$", req.body.first_name);
  cr(p, "$last_name$", req.body.last_name);
  cr(p, "yearbook", req.body.yearbook);
  cr(p, "id_institute_student", req.body.id_institute_student);
  cr(p, "$phone_number$", req.body.phone_number);
  cr(p, "$celphone_number$", req.body.celphone_number);
  cr(p, "$id_person$", req.body.id_person);

  const qry = {};
  qry.where = p;
  qry.include = [{ model: db.persons , attribute: [], include: { model: db.banks , attribute: [] }}];
  qry.raw = true;

  student.findAll(qry).then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding institute."
      });
    });
};

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  let bankobj = {
    "id_bank": req.body.id_bank,
    "id_branch": req.body.id_branch,
    "num": req.body.num
  }
  let data;
  const check = await banks.findOne({ where: { num: req.body.num } })
  if (!check) {
    data = await banks.create(bankobj);
    data = data.id;
  }
  else {
    data = check.id;
  }

  let objperson = {
    "id_person": req.body.id_person,
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "address": req.body.address,
    "phone_number": req.body.phone_number,
    "celphone_number": req.body.celphone_number,
    "Email": req.body.Email,
    "bank_account": data,
    "status_person": true,
    "password": req.body.password

  };
  try {
    const data1 = await person.create(objperson)
    let objstudent = {
      "yearbook": req.body.yearbook,
      "status": 3,
      "id_institute_student": req.body.id_institute_student,
      "tuition": req.body.tuition,
      "id_person_student": data1.id_person
    };

    const data2 = await student.create(objstudent)
    res.send({ data, data1, data2 });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the student."
    });
  };
};


// Update a student by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let p = {};
  let s = {};
  let b={};
  cr(p, "first_name", req.body.first_name);
  cr(p, "last_name", req.body.last_name);
  cr(p, "address", req.body.address);
  cr(p, "phone_number", req.body.phone_number);
  cr(p, "celphone_number", req.body.celphone_number);
  cr(p, "Email", req.body.Email);
  cr(p, "bank_account", req.body.bank_account);
  cr(p, "status_person", req.body.status_person);

  cr(s, "yearbook", req.body.yearbook);
  cr(s, "id_institute_student", req.body.id_institute_student);
  cr(s, "tuition", req.body.tuition);

  cr(b, "id_bank", req.body.id_bank)
  cr(b, "id_branch", req.body.id_branch)
  cr(b, "num", req.body.num)

  if (Object.keys(p).length != 0) {
    person.update(p, { where: { id_person: id } })
      .then(num => {
        if (num == 1) {
          if (Object.keys(s).length != 0) {
            student.update(s, { where: { id_person_student: id } })
              .then(num => {
                if (num == 1) {
                  if (Object.keys(b).length != 0) {
                    banks.update(b, { where: { id: ba } })
                      .then(num => {
                        if (num == 1) {
                          res.send({
                            message: "staff was updated successfully."
                          });
                        }
                        else {
                          res.send({
                            message: `Cannot update bank of staff with id=${id}`
                          });
                        }
                      })
                      .catch(err => {
                        res.status(500).send({
                          message: "Error updating bank with id=" + ba
                        });
                      });
                  }
                }
                else {
                  res.send({
                    message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating student with id=" + id
                });
              });
          }
          else {
            res.send({
              message: "person was updated successfully."
            });
          }
        }
        else {
          res.send({
            message: `Cannot update person with id=${id}. Maybe student was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating person with id=" + id
        });
      });
  }
  else if (Object.keys(s).length != 0) {
    student.update(req.body, { where: { id_person_student: id } })
      .then(num => {
        if (num == 1) {
          if (Object.keys(b).length != 0) {
            banks.update(b, { where: { id: ba } })
              .then(num => {
                if (num == 1) {
                  res.send({
                    message: "staff was updated successfully."
                  });
                }
                else {
                  res.send({
                    message: `Cannot update bank of staff with id=${id}`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating bank with id=" + ba
                });
              });
          }
        } else {
          res.send({
            message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating student with id=" + id
        });
      });
  }
  else if (Object.keys(b).length != 0) {
    banks.update(b, { where: { id: ba } })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "staff was updated successfully."
          });
        }
        else {
          res.send({
            message: `Cannot update bank of staff with id=${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating bank with id=" + ba
        });
      });

  }
};


// // Delete a student with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  let ba = await person.findAll({ where: { id_person: id } })
  if (ba.length == 1) {
    ba = ba.bank_account;
    try {
      student.destroy({
        where: { id_person_student: id }
      }),
        person.destroy({
          where: { id_person: id }
        })
        banks.destroy({
          where: { id: ba }
        })
          .then(num => {
            if (num == 1) {
              status_person = false;
              res.send({
                message: "פרטי התלמיד נמחקו בהצלחה מן המאגר!"
              });
            } else {
              res.send({
                message: `Cannot delete student with id=${id}. Maybe student was not found!`
              });
            }
          })
    }
    catch {
      (err => {
        res.status(500).send({
          message: "Could not delete student with id=" + id
        });
      });
    }
  }
  else {
    try {
      staff.destroy({
        where: { id_person_staff: id }
      }),
        person.destroy({
          where: { id_person: id }
        })
          .then(num => {
            if (num == 1) {
              status_person = false;
              res.send({
                message: "staff was deleted successfully!"
              });
            } else {
              res.send({
                message: `Cannot delete staff with id=${id}. Maybe staff was not found!`
              });
            }
          })
    }
    catch {
      (err => {
        res.status(500).send({
          message: "Could not delete staff with id=" + id
        });
      });
    }
  }
};

