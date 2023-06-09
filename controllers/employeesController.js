// const data = {
//   employees: require("../model/employees.json"),
//   setEmployees: function (data) {
//     this.employees = data
//   },
// }

const Employee = require("../model/Employee")

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
  if (!employees)
    return res.status(204).json({ message: "No employees found." })
  res.json(employees)
}

const createNewEmployee = async (req, res) => {
  //add new
  // const newEmployee = {
  //   id: data.employees?.length
  //     ? data.employees[data.employees.length - 1].id + 1
  //     : 1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  // }
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" })
  }

  // if (!newEmployee.firstname || !newEmployee.lastname) {
  //   return res
  //     .status(400)
  //     .json({ messgae: "First and last names are required." })
  // }

  //data.setEmployees([...data.employees, newEmployee])

  // data.setEmployees([...data.employees, newEmployee])

  // res.status(201).json(data.employees)

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    })
    res.status(201).json(result)
  } catch (err) {
    console.error(err)
  }
}

const updateEmployee = async (req, res) => {
  //update
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // )
  if (!req.body?.id) {
    return res.status(400).json({ message: "ID parameter is required. " })
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec() //Mongo DB uses _id
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` })
  }

  if (req.body.firstname) employee.firstname = req.body.firstname
  if (req.body.lastname) employee.lastname = req.body.lastname

  // const filteredArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // )
  // const unsortedArray = [...filteredArray, employee]
  // data.setEmployees(
  //   unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  // )
  const result = await employee.save()
  res.json(result)

  // res.json(data.employees)
}

const deleteEmployee = async (req, res) => {
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // )
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required." })
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec()
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` })
  }

  // const filterArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // )
  // data.setEmployees([...filterArray])
  // res.json(data.employees)
  const result = await employee.deleteOne({ _id: req.body.id })
  res.json(result)
}

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required." })
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.params.id)
  // )
  const employee = await Employee.findOne({_id: req.params.id}).exec()
  if (!employee) {
    return res
      .status(204)
      .json({ messsage: `No employee matches ID ${req.params.id}.` })
  }
  res.json(employee)
}

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
}
