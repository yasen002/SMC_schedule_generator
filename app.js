// Define UI Vars
const myClass = document.querySelector(".myClass");
const taskList = document.querySelector(".classList");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");
const searchLable = document.querySelector(".searchLable");
const submit = document.querySelector(".btn_submit");
const mainBody = document.querySelector(".colContainer");
const mainDiv = document.querySelector("#main");
var data;

// Load all event listeners
loadEventListeners();
// Load all event listeners
function loadEventListeners() {
  // await getClassData();
  // DOM Load event
  document.addEventListener("DOMContentLoaded", getClasses("icon"));
  // Filter tasks event
  filter.addEventListener("keyup", filterClasses);
  //Add class
  taskList.addEventListener("click", addOrRemoveClass);
  //Remove class
  myClass.addEventListener("click", addOrRemoveClass);
  //Submit
  submit.addEventListener("click", submitClass);
}

// Get Classes from LS. the patameter is to remove the icon. parameter onter than 'none' is to add the icon.
function getClasses(rightIcon) {
  //get class dta from Json
  let classes;
  if (localStorage.getItem("classes") === null) {
    classes = [];
  } else {
    classes = JSON.parse(localStorage.getItem("classes"));
  }

  //add submit button if there is classes in ls
  if (classes.length > 0) {
    document.querySelector(".btn_submit").style.display = "block";
  }

  //loop through each class data, create html, add to UL
  for (var i = 0; i < classes.length; i++) {
    var aClass = classes[i];
    const classItemInnerHTML = `<div>${aClass.class_number}</div>
    <div>${aClass.class_name}</div>
    <div>${aClass.class_instructor}</div>
    <div>${aClass.class_time}</div>`;
    if (rightIcon === "none") {
      AddLiToUL(classItemInnerHTML, "none");
    } else {
      AddLiToUL(classItemInnerHTML, "remove");
    }
  }
}

// Filter Tasks
function filterClasses(e) {
  const text = e.target.value.toLowerCase();
  var searchKey;
  taskList.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    searchKey = data[i][searchLable.id];
    if (searchKey.toLowerCase().indexOf(text) != -1) {
      const classItemInnerHTML = `<div>${data[i].class_number}</div>
      <div>${data[i].class_name}</div>
      <div>${data[i].class_instructor}</div>
      <div>${data[i].class_time}</div>`;

      AddLiToUL(classItemInnerHTML, "add");
    }
  }
}

function AddLiToUL(result, rightIcon) {
  // Create li element
  const li = document.createElement("li");
  li.style.display = "grid";
  li.style.gridTemplateColumns = "1fr 1fr 1fr 1fr auto";
  // Add class
  li.className = "collection-item";
  // Create text node and append to li
  // li.appendChild(document.createTextNode(result));
  li.innerHTML = result;
  // Create new link element
  const link = document.createElement("a");

  // Add apropriate icon html and class
  if (rightIcon == "add") {
    link.className = "add-item secondary-content";
    link.innerHTML = '<i class="fa fa-plus-square"></i>';
    li.appendChild(link);
  } else if (rightIcon == "remove") {
    link.className = "remove-item secondary-content";
    link.innerHTML = '<i class="fa fa-times" ></i>';
    li.appendChild(link);
  }

  // Decide add to myClass or taskList ul
  if (rightIcon == "add") {
    taskList.appendChild(li);
  } else if (rightIcon == "remove") {
    myClass.appendChild(li);
  } else if (rightIcon == "none") {
    //need transparent background for IMG
    li.style.background = "none";
    li.style.fontWeight = "500";
    document.querySelector(".schedule").appendChild(li);
  }
}

// Add or reamove class
function addOrRemoveClass(e) {
  //show the submit button
  document.querySelector(".btn_submit").style.display = "block";
  const rightIcon = e.target.parentElement.classList;
  var classData = e.target.parentElement.parentElement;
  if (rightIcon.contains("add-item")) {
    // Store in LS
    storeClassInLocalStorage(classData);
    //remove the '+' anchor tag
    var data = classData.innerHTML.slice(0, -75);
    AddLiToUL(data, "remove");
    classData.remove();
  } else if (rightIcon.contains("remove-item")) {
    //remove added class from filter result
    classData.remove();
    // Remove from LS
    removeClassFromLocalStorage(classData);
  }
}

//Switchs the id of input lable upon click of the "rearch by" button
function SearchChoice(e) {
  //change search key and lable by changing HTML element ID
  searchLable.id = e;
  if (e == "class_number") {
    searchLable.textContent = "Search by Section Number";
  } else if (e == "class_instructor") {
    searchLable.textContent = "Search by Instructor Name";
  } else if (e == "class_name") {
    searchLable.textContent = "Search by Class Name";
  }
  document.querySelector("#filter").value = "";
}

//stres the data to LS. param=<li> collection with 4 div
function storeClassInLocalStorage(classData) {
  let classes;
  if (localStorage.getItem("classes") === null) {
    classes = [];
  } else {
    classes = JSON.parse(localStorage.getItem("classes"));
  }
  var children = classData.children;
  var childrenTxts = [];
  for (var i = 0; i < children.length; i++) {
    childrenTxts.push(children[i].textContent);
  }
  var extractedClassData = {
    class_number: childrenTxts[0],
    class_name: childrenTxts[1],
    class_instructor: childrenTxts[2],
    class_time: childrenTxts[3]
  };

  classes.push(extractedClassData);
  localStorage.setItem("classes", JSON.stringify(classes));
}

//Remove Class from LS
function removeClassFromLocalStorage(classData) {
  let classes;
  if (localStorage.getItem("classes") === null) {
    classes = [];
  } else {
    classes = JSON.parse(localStorage.getItem("classes"));
  }
  //use class numbet as and ID to search LS data match
  const key = classData.children[0].textContent;
  classes.forEach(function(aClass, index) {
    if (aClass.class_number === key) {
      classes.splice(index, 1);
    }
  });

  localStorage.setItem("classes", JSON.stringify(classes));
}

//crate schedule
async function submitClass() {
  //hide main div
  mainDiv.style.display = "none";
  //if create schedule already axist then display block and break the function
  var axistCreate_schedule = document.querySelector(".create_schedule");
  if (axistCreate_schedule) {
    axistCreate_schedule.style.display = "block";
    return 0;
  }
  //create html elements
  const cardDiv = document.createElement("div");
  cardDiv.style.display = "block";
  const cardContentDiv = document.createElement("div");
  // cardContentDiv.style.backgroundImage = `url(./img/12.jpg)`;

  //set background imgae styles
  let imageName = "defocused";
  cardContentDiv.style.cssText += `
  background:linear-gradient(to right bottom, #49cf31c6, #28b485b1), url(./img/${getRandomInt(
    1,
    4
  )}.jpg) no-repeat center center fixed ; 
  
  `;

  // url(buttons/' + imagePrefix + '.png)';
  const cardAction = document.createElement("div");
  const ul = document.createElement("ul");
  const changeClassBtn = document.createElement("button");
  cardDiv.className = "create_schedule card";
  cardDiv.style.height = "90vh";
  cardContentDiv.className = "scheduleContent card-content";
  cardAction.className = "scheduleAction card-action";
  ul.className = "collection schedule row";
  changeClassBtn.textContent = "Go Back";
  changeClassBtn.className = "waves-effect waves-light btn";

  //connenct html elements
  cardAction.appendChild(changeClassBtn);
  cardContentDiv.appendChild(ul);
  cardDiv.appendChild(cardContentDiv);
  cardDiv.appendChild(cardAction);
  mainBody.appendChild(cardDiv);
  //get classes from LS
  getClasses("none");

  //Go back button event listener
  changeClassBtn.onclick = () => {
    mainDiv.style.display = "block";
    cardDiv.remove();
  };

  //Go back button event listener
  downloadScheduleBtn.onclick = () => {
    console.log("download");
    cardDiv.toDataURL();
  };
}

//random number generator from Mozila.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

////--------------load data using xhr method-----------------------
//---comment: using XHR and keep the UI data in a data base at leat a
//separate file is a right way to do it. but i like the instand data
//update.
//
// function getClassData(){
//   const xhr = new XMLHttpRequest();
//   console.log('hello from get class data')
//   //open
//   xhr.open('GET', 'classData.json',true);
//   xhr.onload = function(){
//   if(this.status ===200){
//     data = JSON.parse(this.responseText);
//     console.log('data', data.length);
//     }
//   }
//   xhr.onerror = ()=>console.log("Request error...")
//   xhr.send();

// }

// const xhr = new XMLHttpRequest();
// //open
// xhr.open('GET', 'create_schedule.html',true);
// xhr.onload = function(){
// if(this.status ===200){
//   mainDiv.style.display = 'none'
//   mainBody.innerHTML = this.responseText;
//   }
// }
// xhr.onerror = ()=>console.log("Request error...")
// xhr.send();

//-----------------------------------------------------------------------------------
//these are the data that has beeb scrapped from SMC website using the scrapping.py file
data = [
  {
    class_number: "1001",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "BUS 254",
    class_instructor: "Knight R B",
    class_name: "ACCTG 1",
    class_title: "Introduction to Financial Accounting 5 units"
  },
  {
    class_number: "1019",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "BUS 119",
    class_instructor: "Trippetti V J",
    class_name: "ACCTG 2",
    class_title: "Corporate Financial and Managerial Accounting 5 units"
  },
  {
    class_number: "1032",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Hanson M P",
    class_name: "ACCTG 6",
    class_title: "Accounting Consolidations 3 units"
  },
  {
    class_number: "1033",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Hanson M P",
    class_name: "ACCTG 7",
    class_title: "Advanced Accounting: Special Topics 3 units"
  },
  {
    class_number: "1034",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Kim J S",
    class_name: "ACCTG 9",
    class_title: "Accounting Ethics 3 units"
  },
  {
    class_number: "1037",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lu M",
    class_name: "ACCTG 10A",
    class_title: "Intermediate Accounting A 3 units"
  },
  {
    class_number: "1040",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lu M",
    class_name: "ACCTG 10B",
    class_title: "Intermediate Accounting B 3 units"
  },
  {
    class_number: "1042",
    class_time: "Arrange  -  9 Hours ",
    class_location: " ONLINE",
    class_instructor: "Hanson M P",
    class_name: "ACCTG 10C",
    class_title: "Intermediate Accounting C 4 units"
  },
  {
    class_number: "1044",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Carballo P S",
    class_name: "ACCTG 11",
    class_title: "Cost Accounting 3 units"
  },
  {
    class_number: "1045",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Steinberger E K",
    class_name: "ACCTG 12",
    class_title: "Auditing 3 units"
  },
  {
    class_number: "1047",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rubio C",
    class_name: "ACCTG 15",
    class_title: "Individual Income Taxes 3 units"
  },
  {
    class_number: "1048",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rubio C",
    class_name: "ACCTG 16",
    class_title:
      "Taxation of Corporations, Partnerships, Estates and Trusts 3 units"
  },
  {
    class_number: "1049",
    class_time: "7:30 a.m.  -  5 p.m. FS",
    class_location: "BUNDY 119",
    class_instructor: "Rubio C",
    class_name: "ACCTG 19A",
    class_title:
      "IRS Volunteer Income Tax Assistance (VITA) Program - Tax Preparer 1 unit"
  },
  {
    class_number: "1050",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUS 263",
    class_instructor: "Brookins G T",
    class_name: "ACCTG 21",
    class_title: "Business Bookkeeping 3 units"
  },
  {
    class_number: "1054",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lopez En",
    class_name: "ACCTG 22",
    class_title: "Advanced Bookkeeping 3 units"
  },
  {
    class_number: "1055",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lopez En",
    class_name: "ACCTG 23",
    class_title: "Payroll Accounting 3 units"
  },
  {
    class_number: "1056",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "ACCTG 31A",
    class_title: "Excel for Accounting 3 units"
  },
  {
    class_number: "1057",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "ACCTG 31B",
    class_title: "Advanced Excel for Accounting 3 units"
  },
  {
    class_number: "1058",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 207",
    class_instructor: "Resnick W J",
    class_name: "ACCTG 45",
    class_title: "Individual Financial Planning 3 units"
  },
  {
    class_number: "1065",
    class_time: "Arrange  -  1 Hour ",
    class_location: "BUS 220A",
    class_instructor: "Veas S",
    class_name: "ACCTG 88A",
    class_title: "Independent Studies in Accounting 1 unit"
  },
  {
    class_number: "1066",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUS 220A",
    class_instructor: "Veas S",
    class_name: "ACCTG 88B",
    class_title: "Independent Studies in Accounting 2 units"
  },
  {
    class_number: "1067",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 106",
    class_instructor: "Khalil N",
    class_name: "AD JUS 1",
    class_title: "Introduction to Administration of Justice 3 units"
  },
  {
    class_number: "1072",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Junghahn L A",
    class_name: "AD JUS 2",
    class_title: "Concepts of Criminal Law 3 units"
  },
  {
    class_number: "1073",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "BUS 252",
    class_instructor: "Smith Deborah R",
    class_name: "AD JUS 3",
    class_title: "Legal Aspects of Evidence 3 units"
  },
  {
    class_number: "4005",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "BUS 144",
    class_instructor: "Darden C A",
    class_name: "AD JUS 5",
    class_title: "Criminal Investigation 3 units"
  },
  {
    class_number: "1074",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "BUS 144",
    class_instructor: "Smith Deborah R",
    class_name: "AD JUS 8",
    class_title: "Juvenile Procedures 3 units"
  },
  {
    class_number: "1075",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "BUS 144",
    class_instructor: "Staff",
    class_name: "AD JUS 11",
    class_title: "Introduction to Forensics 3 units"
  },
  {
    class_number: "1237",
    class_time: "9:30 a.m. - 11 a.m. TThF",
    class_location: "BUNDY 415",
    class_instructor: "Cole B M",
    class_name: "ASL 1",
    class_title: "American Sign Language 1 5 units"
  },
  {
    class_number: "1238",
    class_time: "2:30 p.m.  -  4:55 p.m. TTh",
    class_location: "HSS 204",
    class_instructor: "Lewis B J",
    class_name: "ASL 2",
    class_title: "American Sign Language 2 5 units"
  },
  {
    class_number: "1134",
    class_time: "9:30 a.m. - 12:35 p.m. M",
    class_location: "CMD 180",
    class_instructor: "Keeshen J F",
    class_name: "ANIM 1",
    class_title: "Storytelling 3 units"
  },
  {
    class_number: "1135",
    class_time: "9:30 a.m.  -  1:35 p.m. W",
    class_location: "CMD 125",
    class_instructor: "Keeshen J F",
    class_name: "ANIM 2",
    class_title: "2D Animation Fundamentals 3 units"
  },
  {
    class_number: "1136",
    class_time: "1 p.m.  -  5:05 p.m. T",
    class_location: "CMD 207",
    class_instructor: "Fria C T",
    class_name: "ANIM 3",
    class_title: "3D Fundamentals 3 units"
  },
  {
    class_number: "3456",
    class_time: "2 p.m.  -  6:05 p.m. F",
    class_location: "CMD 125",
    class_instructor: "Klautky E K",
    class_name: "ANIM 4",
    class_title: "Digital Storyboarding 3 units"
  },
  {
    class_number: "1137",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Poirier N P",
    class_name: "ANIM 5",
    class_title: "History of Animation 3 units"
  },
  {
    class_number: "1138",
    class_time: "2 p.m.  -  6:05 p.m. M",
    class_location: "CMD 124",
    class_instructor: "Staff",
    class_name: "ANIM 18",
    class_title: "Perspective Drawing 2 units"
  },
  {
    class_number: "1139",
    class_time: "9:30 a.m.  -  1:35 p.m. F",
    class_location: "CMD 125",
    class_instructor: "Staff",
    class_name: "ANIM 19",
    class_title: "Color Theory & Application 3 units"
  },
  {
    class_number: "1140",
    class_time: "9:30 a.m.  -  1:35 p.m. T",
    class_location: "CMD 125",
    class_instructor: "Davis J A",
    class_name: "ANIM 20",
    class_title: "Intermediate 2D Animation 3 units"
  },
  {
    class_number: "4017",
    class_time: "6:30 p.m.  -  9:35 p.m. M",
    class_location: "CMD 207",
    class_instructor: "Williams V J",
    class_name: "ANIM 30",
    class_title: "Intermediate 3D Animation 3 units"
  },
  {
    class_number: "1141",
    class_time: "9:30 a.m. - 12:35 p.m. W",
    class_location: "CMD 207",
    class_instructor: "Fria C T",
    class_name: "ANIM 35",
    class_title: "3D Modeling 3 units"
  },
  {
    class_number: "1142",
    class_time: "9:30 a.m. - 12:35 p.m. S",
    class_location: "CMD 125",
    class_instructor: "Staff",
    class_name: "ANIM 36",
    class_title: "3D Texturing & Rendering 3 units"
  },
  {
    class_number: "4018",
    class_time: "5:30 p.m.  -  9:35 p.m. Th",
    class_location: "CMD 125",
    class_instructor: "Davis J A",
    class_name: "ANIM 40",
    class_title: "Character Design 3 units"
  },
  {
    class_number: "1143",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Nagel J G",
    class_name: "ANIM 75",
    class_title: "Career Development 3 units"
  },
  {
    class_number: "1144",
    class_time: "2 p.m.  -  5:05 p.m. M",
    class_location: "CMD 125",
    class_instructor: "Brown S S",
    class_name: "ANIM 80",
    class_title: "Visual Development Studio 3 units"
  },
  {
    class_number: "1145",
    class_time: "9:30 a.m.  -  1:35 p.m. M",
    class_location: "CMD 207",
    class_instructor: "Fria C T",
    class_name: "ANIM 85",
    class_title: "Animation Studio 3 units"
  },
  {
    class_number: "1146",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "DRSCHR 208",
    class_instructor: "Haradon C M",
    class_name: "ANTHRO 1",
    class_title: "Physical Anthropology 3 units"
  },
  {
    class_number: "1152",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 205",
    class_instructor: "Minzenberg E G",
    class_name: "ANTHRO 2",
    class_title: "Cultural Anthropology 3 units"
  },
  {
    class_number: "1157",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "DRSCHR 207",
    class_instructor: "Lewis B S",
    class_name: "ANTHRO 3",
    class_title: "World Archaeology 3 units"
  },
  {
    class_number: "1159",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 208",
    class_instructor: "Lewis B S",
    class_name: "ANTHRO 4",
    class_title: "Methods of Archaeology 3 units"
  },
  {
    class_number: "1161",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "DRSCHR 136",
    class_instructor: "Brewster C P",
    class_name: "ANTHRO 5",
    class_title: "Physical Anthropology with Lab 4 units"
  },
  {
    class_number: "4023",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "DRSCHR 207",
    class_instructor: "Cohen M M",
    class_name: "ANTHRO 7",
    class_title: "Introduction to Linguistic Anthropology 3 units"
  },
  {
    class_number: "1164",
    class_time: "3:45 p.m.  -  5:05 p.m. MW",
    class_location: "DRSCHR 136",
    class_instructor: "Uy J K",
    class_name: "ANTHRO 9",
    class_title: "Paleoanthropology 3 units"
  },
  {
    class_number: "1165",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "BUS 259",
    class_instructor: "Brewster C P",
    class_name: "ANTHRO 10",
    class_title: "Forensic Anthropology 3 units"
  },
  {
    class_number: "1166",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "BUS 259",
    class_instructor: "Strauss E M",
    class_name: "ANTHRO 14",
    class_title: "Sex, Gender and Culture 3 units"
  },
  {
    class_number: "1167",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "DRSCHR 207",
    class_instructor: "Minzenberg E G",
    class_name: "ANTHRO 19",
    class_title: "The Culture of Food 3 units"
  },
  {
    class_number: "1168",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "DRSCHR 208",
    class_instructor: "Minzenberg E G",
    class_name: "ANTHRO 21",
    class_title: "Peoples and Power in Latin America 3 units"
  },
  {
    class_number: "1169",
    class_time: "3:45 p.m.  -  5:05 p.m. MW",
    class_location: "DRSCHR 207",
    class_instructor: "Zane W W",
    class_name: "ANTHRO 22",
    class_title: "Magic, Religion, and Witchcraft 3 units"
  },
  {
    class_number: "2226",
    class_time: "Arrange  -  1 Hour ",
    class_location: "DRSCHR 314M",
    class_instructor: "Minzenberg E G",
    class_name: "ERTHSC 88A",
    class_title: "Independent Studies in Earth Science 1 unit"
  },
  {
    class_number: "4024",
    class_time: "7:30 p.m.  -  9:55 p.m. TTh",
    class_location: "HSS 203",
    class_instructor: "Bezrati S",
    class_name: "ARABIC 1",
    class_title: "Elementary Arabic 1 5 units"
  },
  {
    class_number: "1172",
    class_time: "8 a.m.  -  1:05 p.m. F",
    class_location: "A 220",
    class_instructor: "Arutian C L",
    class_name: "ART 10A",
    class_title: "Design I 3 units"
  },
  {
    class_number: "1183",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "A 220",
    class_instructor: "Badger C P",
    class_name: "ART 10B",
    class_title: "Design II 3 units"
  },
  {
    class_number: "1185",
    class_time: "11:15 a.m.  -  1:40 p.m. MW",
    class_location: "A 119",
    class_instructor: "Badger C P",
    class_name: "ART 10C",
    class_title: "Computer Design 3 units"
  },
  {
    class_number: "1187",
    class_time: "12:45 p.m.  -  3:10 p.m. TTh",
    class_location: "A 124",
    class_instructor: "Hartman D G",
    class_name: "ART 13",
    class_title: "3D Design 3 units"
  },
  {
    class_number: "1189",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "A 126",
    class_instructor: "Joller G",
    class_name: "ART 17A",
    class_title: "3D Jewelry Design I 3 units"
  },
  {
    class_number: "1191",
    class_time: "9 a.m.  -  2:10 p.m. S",
    class_location: "A 126",
    class_instructor: "Joller G",
    class_name: "ART 17B",
    class_title: "3D Jewelry Design II 3 units"
  },
  {
    class_number: "1192",
    class_time: "8 a.m.  -  1:10 p.m. F",
    class_location: "A 102",
    class_instructor: "Vicich G M",
    class_name: "ART 20A",
    class_title: "Drawing I 3 units"
  },
  {
    class_number: "1203",
    class_time: "8 a.m.  -  1:10 p.m. F",
    class_location: "A 100",
    class_instructor: "Mammarella C J",
    class_name: "ART 20B",
    class_title: "Drawing II 3 units"
  },
  {
    class_number: "1206",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "A 100",
    class_instructor: "Trujillo M E",
    class_name: "ART 21A",
    class_title: "Drawing III 3 units"
  },
  {
    class_number: "3534",
    class_time: "2:15 p.m.  -  7:15 p.m. M",
    class_location: "A 100",
    class_instructor: "Kompaneyets M",
    class_name: "ART 21B",
    class_title: "Drawing IV 3 units"
  },
  {
    class_number: "1209",
    class_time: "2:15 p.m.  -  4:40 p.m. MW",
    class_location: "A 220",
    class_instructor: "Shibata J M",
    class_name: "ART 30A",
    class_title: "Beginning Watercolor Painting I 3 units"
  },
  {
    class_number: "3552",
    class_time: "9 a.m.  -  2:10 p.m. S",
    class_location: "A 118",
    class_instructor: "Aarons R R",
    class_name: "ART 30B",
    class_title: "Watercolor Painting II 3 units"
  },
  {
    class_number: "1210",
    class_time: "9 a.m.  -  2:10 p.m. S",
    class_location: "A 220",
    class_instructor: "Ota N T",
    class_name: "ART 30C",
    class_title: "Acrylic Painting Techniques 3 units"
  },
  {
    class_number: "1211",
    class_time: "8 a.m.  -  1:10 p.m. W",
    class_location: "A 100",
    class_instructor: "Trujillo M E",
    class_name: "ART 31",
    class_title: "Beginning Oil Painting 3 units"
  },
  {
    class_number: "1214",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "AIR 117",
    class_instructor: "Hatton C",
    class_name: "ART 32",
    class_title: "Intermediate Painting 3 units"
  },
  {
    class_number: "1216",
    class_time: "2 p.m.  -  7:05 p.m. W",
    class_location: "A 100",
    class_instructor: "Trujillo M E",
    class_name: "ART 33",
    class_title: "Figure Painting 3 units"
  },
  {
    class_number: "1217",
    class_time: "8:30 a.m.  -  1:30 p.m. F",
    class_location: "AIR 117",
    class_instructor: "Badger C P",
    class_name: "ART 34A",
    class_title: "Contemporary Art Theory and Practice 3 units"
  },
  {
    class_number: "1218",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "A 124",
    class_instructor: "Hartman D G",
    class_name: "ART 40A",
    class_title: "Sculpture I 3 units"
  },
  {
    class_number: "1221",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "A 124",
    class_instructor: "Hartman D G",
    class_name: "ART 40B",
    class_title: "Sculpture II 3 units"
  },
  {
    class_number: "1222",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "A 124",
    class_instructor: "Hartman D G",
    class_name: "ART 40C",
    class_title: "Sculpture III 3 units"
  },
  {
    class_number: "1223",
    class_time: "9 a.m.  -  2:05 p.m. M",
    class_location: "CMD 286",
    class_instructor: "Simon D L",
    class_name: "ART 41A",
    class_title: "Figure Modeling Sculpture I 3 units"
  },
  {
    class_number: "3535",
    class_time: "9 a.m.  -  2:05 p.m. M",
    class_location: "CMD 286",
    class_instructor: "Simon D L",
    class_name: "ART 41B",
    class_title: "Figure Modeling Sculpture II 3 units"
  },
  {
    class_number: "1224",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "AIR 170",
    class_instructor: "Phillips F",
    class_name: "ART 52A",
    class_title: "Ceramics I 3 units"
  },
  {
    class_number: "1229",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "AIR 170",
    class_instructor: "Phillips F",
    class_name: "ART 52C",
    class_title: "Ceramics III 3 units"
  },
  {
    class_number: "1230",
    class_time: "8:30 a.m. - 10:55 a.m. MW",
    class_location: "A 126",
    class_instructor: "Thomason M M",
    class_name: "ART 60",
    class_title: "Introduction to Printmaking 3 units"
  },
  {
    class_number: "1231",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "A 119",
    class_instructor: "Winsryg M W",
    class_name: "ART 60B",
    class_title: "Introduction to Digital Printing 3 units"
  },
  {
    class_number: "1232",
    class_time: "11:15 a.m.  -  2 p.m. MW",
    class_location: "A 126",
    class_instructor: "Thomason M M",
    class_name: "ART 62",
    class_title: "Serigraphy (Silkscreen) 3 units"
  },
  {
    class_number: "1233",
    class_time: "2 p.m.  -  5 p.m. M",
    class_location: "A 119",
    class_instructor: "Badger C P",
    class_name: "ART 74",
    class_title: "Introduction to Programming in the Arts 3 units"
  },
  {
    class_number: "1234",
    class_time: "Arrange  -  4 Hours ",
    class_location: " ",
    class_instructor: "Meyer W J",
    class_name: "ART 90A",
    class_title: "Internship 1 unit"
  },
  {
    class_number: "1236",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Hatton C",
    class_name: "ARTS 88B",
    class_title: "Independent Studies in the Arts 2 units"
  },
  {
    class_number: "1077",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "A 214",
    class_instructor: "Leaper L E",
    class_name: "AHIS 1",
    class_title: "Western Art History I 3 units"
  },
  {
    class_number: "1088",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "A 214",
    class_instructor: "Medvedev N",
    class_name: "AHIS 2",
    class_title: "Western Art History II 3 units"
  },
  {
    class_number: "1095",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "A 214",
    class_instructor: "Chandler M M",
    class_name: "AHIS 3",
    class_title: "Western Art History III 3 units"
  },
  {
    class_number: "1097",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "A 214",
    class_instructor: "Simmons B B",
    class_name: "AHIS 5",
    class_title: "Latin American Art History 1 3 units"
  },
  {
    class_number: "1098",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Simmons B B",
    class_name: "AHIS 6",
    class_title: "Latin American Art History 2 3 units"
  },
  {
    class_number: "1099",
    class_time: "9 a.m. - 12 p.m. F",
    class_location: "A 214",
    class_instructor: "Ahmadpour A",
    class_name: "AHIS 11",
    class_title:
      "Art Appreciation: Introduction to Global Visual Culture 3 units"
  },
  {
    class_number: "1106",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "A 214",
    class_instructor: "Senarath Gamage L",
    class_name: "AHIS 17",
    class_title: "Arts of Asia 3 units"
  },
  {
    class_number: "1109",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "A 214",
    class_instructor: "Simmons B B",
    class_name: "AHIS 18",
    class_title: "Introduction to African Art History 3 units"
  },
  {
    class_number: "1110",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rocchio M P",
    class_name: "AHIS 21",
    class_title: "Architectural History: Ancient to 1850 3 units"
  },
  {
    class_number: "3499",
    class_time: "2 p.m.  -  5:05 p.m. M",
    class_location: "CMD 104",
    class_instructor: "Rocchio M P",
    class_name: "AHIS 22",
    class_title: "Architectural History and Theory - 1850 to Present 3 units"
  },
  {
    class_number: "1111",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "A 214",
    class_instructor: "Dastin E R",
    class_name: "AHIS 52",
    class_title: "History of Photography 3 units"
  },
  {
    class_number: "1113",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "SSC 291",
    class_instructor: "Rodriguez K",
    class_name: "AHIS 72",
    class_title: "American Art History 3 units"
  },
  {
    class_number: "1115",
    class_time: "Arrange  -  4 Hours ",
    class_location: " ",
    class_instructor: "Meyer W J",
    class_name: "AHIS 90A",
    class_title: "Internship in Art History 1 unit"
  },
  {
    class_number: "9701",
    class_time: "9 a.m. - 10:50 a.m. F",
    class_location: "EC 1227 409",
    class_instructor: "Walker C L",
    class_name: "ART E00",
    class_title: "Survey of Art"
  },
  {
    class_number: "9706",
    class_time: "10 a.m. - 11:50 a.m. M",
    class_location: " ITINERY",
    class_instructor: "Jaeger J E",
    class_name: "ART E06",
    class_title: "Artistic Expression through Gardening"
  },
  {
    class_number: "9708",
    class_time: "9 a.m. - 11:15 a.m. F",
    class_location: "EC 1227 204",
    class_instructor: "Hero C J",
    class_name: "ART E15",
    class_title: "Drawing"
  },
  {
    class_number: "9710",
    class_time: "9 a.m. - 11:50 a.m. M",
    class_location: "EC 1227 205",
    class_instructor: "Adams L K",
    class_name: "ART E16",
    class_title: "Life Drawing Studio"
  },
  {
    class_number: "9712",
    class_time: "9 a.m. - 11:50 a.m. W",
    class_location: "EC 1227 204",
    class_instructor: "Tirr C A",
    class_name: "ART E19",
    class_title: "Painting"
  },
  {
    class_number: "9716",
    class_time: "9 a.m. - 11:15 a.m. M",
    class_location: "EC 1227 204",
    class_instructor: "Benson J K",
    class_name: "ART E20",
    class_title: "Drawing and Painting"
  },
  {
    class_number: "9719",
    class_time: "11:30 a.m.  -  1:45 p.m. M",
    class_location: "EC 1227 204",
    class_instructor: "Harrison A B",
    class_name: "ART E21",
    class_title: "Painting/Drawing, Oil and Acrylic"
  },
  {
    class_number: "9721",
    class_time: "9 a.m. - 11:15 a.m. T",
    class_location: "EC 1227 204",
    class_instructor: "Manseau F J",
    class_name: "ART E22",
    class_title: "Watercolor"
  },
  {
    class_number: "9723",
    class_time: "9:30 a.m. - 11:20 a.m. F",
    class_location: " 1450OCEN",
    class_instructor: "Martorello J M",
    class_name: "ART E24",
    class_title: "Calligraphy II"
  },
  {
    class_number: "9724",
    class_time: "9 a.m. - 11:50 a.m. Th",
    class_location: " ITINERY",
    class_instructor: "Walker C L",
    class_name: "ART E30",
    class_title: "Watercolor Studio"
  },
  {
    class_number: "9728",
    class_time: "12 p.m.  -  2:15 p.m. Th",
    class_location: "EC 1227 205",
    class_instructor: "Staff",
    class_name: "ART E55",
    class_title: "Sculpture"
  },
  {
    class_number: "9729",
    class_time: "11:30 a.m.  -  1:45 p.m. Th",
    class_location: " 1450OCEN",
    class_instructor: "Ryza S V",
    class_name: "ART E80",
    class_title: "Jewelry Making"
  },
  {
    class_number: "9784",
    class_time: "1:30 p.m.  -  4:20 p.m. W",
    class_location: " 1450OCEN",
    class_instructor: "Ryza S V",
    class_name: "HME EC E71",
    class_title: "Needlecrafts II"
  },
  {
    class_number: "1240",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "BUS 203",
    class_instructor: "Balm S P",
    class_name: "ASTRON 1",
    class_title: "Stellar Astronomy 3 units"
  },
  {
    class_number: "1244",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Schwartz M J",
    class_name: "ASTRON 2",
    class_title: "Planetary Astronomy 3 units"
  },
  {
    class_number: "1247",
    class_time: "8 a.m. - 11:05 a.m. T",
    class_location: "DRSCHR 128",
    class_instructor: "Salama A H",
    class_name: "ASTRON 3",
    class_title: "Stellar Astronomy with Laboratory 4 units"
  },
  {
    class_number: "1248",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "DRSCHR 128",
    class_instructor: "Sobel H",
    class_name: "ASTRON 4",
    class_title: "Planetary Astronomy with Laboratory 4 units"
  },
  {
    class_number: "1252",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "HSS 251",
    class_instructor: "Salama A H",
    class_name: "ASTRON 5",
    class_title: "Life in the Universe 3 units"
  },
  {
    class_number: "1253",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Fouts G A",
    class_name: "ASTRON 6",
    class_title: "Archaeoastronomy 3 units"
  },
  {
    class_number: "1254",
    class_time: "9 a.m.  -  2:05 p.m. S",
    class_location: " SMHS",
    class_instructor: "Staff",
    class_name: "AUTO 40",
    class_title: "Automotive Maintenance and Operation 3 units"
  },
  {
    class_number: "4444",
    class_time: "5:30 p.m.  -  7:55 p.m. MW",
    class_location: " SMHS",
    class_instructor: "Oates S M",
    class_name: "AUTO 46",
    class_title: "Automotive Electrical Systems 3 units"
  },
  {
    class_number: "4037",
    class_time: "5:30 p.m.  -  7:55 p.m. TTh",
    class_location: " SMHS",
    class_instructor: "Oates S M",
    class_name: "AUTO 47",
    class_title: "Suspension and Steering 3 units"
  },
  {
    class_number: "7001",
    class_time: "6 p.m.  -  8:30 p.m. MW",
    class_location: "LS 174",
    class_instructor: "Roddy M",
    class_name: "BCYCLE 901",
    class_title: "Bicycle Maintenance Level 1 0 units"
  },
  {
    class_number: "7002",
    class_time: "6 p.m.  -  8:30 p.m. MW",
    class_location: "LS 174",
    class_instructor: "Roddy M",
    class_name: "BCYCLE 902",
    class_title: "Bicycle Maintenance Level 2 0 units"
  },
  {
    class_number: "1116",
    class_time: "7:30 a.m. - 10:35 a.m. MW",
    class_location: "SCI 224",
    class_instructor: "Kanjanapangka J",
    class_name: "ANATMY 1",
    class_title: "General Human Anatomy 4 units"
  },
  {
    class_number: "4431",
    class_time: "6:30 p.m.  -  9:35 p.m. MW",
    class_location: "SCI 224",
    class_instructor: "Grant C",
    class_name: "ANATMY 2",
    class_title: "Advanced Human Anatomy 4 units"
  },
  {
    class_number: "1255",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "SCI 145",
    class_instructor: "Denmon A P",
    class_name: "BIOL 2",
    class_title: "Human Biology 3 units"
  },
  {
    class_number: "1266",
    class_time: "8 a.m. - 11:05 a.m. MW",
    class_location: "SCI 225",
    class_instructor: "Kim-Rajab O S",
    class_name: "BIOL 3",
    class_title: "Fundamentals of Biology 4 units"
  },
  {
    class_number: "1284",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "SCI 151",
    class_instructor: "Davis H A",
    class_name: "BIOL 9",
    class_title: "Environmental Biology 3 units"
  },
  {
    class_number: "1289",
    class_time: "9:30 a.m. - 12:35 p.m. MW",
    class_location: "SCI 333",
    class_instructor: "Raymer P C",
    class_name: "BIOL 10",
    class_title: "Applied Ecology and Conservation Biology 4 units"
  },
  {
    class_number: "1290",
    class_time: "8 a.m. - 11:05 a.m. MW",
    class_location: "SCI 134",
    class_instructor: "Baghdasarian G",
    class_name: "BIOL 15",
    class_title: "Marine Biology with Laboratory 4 units"
  },
  {
    class_number: "1294",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "SCI 151",
    class_instructor: "Fox C H",
    class_name: "BIOL 15N",
    class_title: "Marine Biology (Non-Laboratory) 3 units"
  },
  {
    class_number: "1296",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "SCI 159",
    class_instructor: "Scuric Z",
    class_name: "BIOL 21",
    class_title: "Cell Biology and Evolution 4 units"
  },
  {
    class_number: "1300",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "SCI 151",
    class_instructor: "Staff",
    class_name: "BIOL 22",
    class_title: "Genetics and Molecular Biology 4 units"
  },
  {
    class_number: "1303",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "SCI 145",
    class_instructor: "Nichols L B",
    class_name: "BIOL 23",
    class_title: "Organismal and Environmental Biology 5 units"
  },
  {
    class_number: "1305",
    class_time: "Arrange  -  1 Hour ",
    class_location: "SCI 285",
    class_instructor: "Tower J A",
    class_name: "BIOL 88A",
    class_title: "Independent Studies in Biological Sciences 1 unit"
  },
  {
    class_number: "1306",
    class_time: "Arrange  -  2 Hours ",
    class_location: "SCI 285",
    class_instructor: "Tower J A",
    class_name: "BIOL 88B",
    class_title: "Independent Studies in Biological Sciences 2 units"
  },
  {
    class_number: "1308",
    class_time: "Arrange  -  4 Hours ",
    class_location: "SCI 285",
    class_instructor: "Tower J A",
    class_name: "BIOL 90A",
    class_title: "Life Science Internship 1 unit"
  },
  {
    class_number: "1309",
    class_time: "8 a.m. - 11:05 a.m. T",
    class_location: "SCI 333",
    class_instructor: "Haghighat M",
    class_name: "BOTANY 1",
    class_title: "General Botany 4 units"
  },
  {
    class_number: "1311",
    class_time: "11:30 a.m. - 12:50 p.m. TTh",
    class_location: "SCI 333",
    class_instructor: "Davis H A",
    class_name: "BOTANY 3",
    class_title: "Field Botany 4 units"
  },
  {
    class_number: "2891",
    class_time: "8 a.m. - 11:05 a.m. MWF",
    class_location: "SCI 209",
    class_instructor: "Narey V",
    class_name: "MCRBIO 1",
    class_title: "Fundamentals of Microbiology 5 units"
  },
  {
    class_number: "3068",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "SCI 159",
    class_instructor: "Ortega Y",
    class_name: "NUTR 1",
    class_title: "Introduction to Nutrition Science 3 units"
  },
  {
    class_number: "3082",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "SCI 151",
    class_instructor: "Novak D S",
    class_name: "NUTR 4",
    class_title: "Healthy Lifestyle: Food and Fitness 3 units"
  },
  {
    class_number: "3083",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "SCI 159",
    class_instructor: "Gonzalez C L",
    class_name: "NUTR 7",
    class_title: "Food and Culture in America 3 units"
  },
  {
    class_number: "3085",
    class_time: "3:45 p.m.  -  5:45 p.m. M",
    class_location: "SCI 159",
    class_instructor: "Reid K L",
    class_name: "NUTR 8",
    class_title: "Principles of Food with Lab 3 units"
  },
  {
    class_number: "3177",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "SCI 201",
    class_instructor: "Wissmann P B",
    class_name: "PHYS 3",
    class_title: "Human Physiology 4 units"
  },
  {
    class_number: "3446",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "SCI 145",
    class_instructor: "Gartner G E",
    class_name: "ZOOL 5",
    class_title: "Introductory Zoology 4 units"
  },
  {
    class_number: "1312",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "BUS 263",
    class_instructor: "Paik R",
    class_name: "BUS 1",
    class_title: "Introduction to Business 3 units"
  },
  {
    class_number: "1332",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "BUS 144",
    class_instructor: "Rados-Cloke A",
    class_name: "BUS 5",
    class_title: "Business Law and the Legal Environment 3 units"
  },
  {
    class_number: "1345",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Halliday-Robert Ca E",
    class_name: "BUS 6",
    class_title: "Advanced Business Law 3 units"
  },
  {
    class_number: "1346",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Khalil N",
    class_name: "BUS 8",
    class_title: "Law for the Entrepreneur 3 units"
  },
  {
    class_number: "1347",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Khalil N",
    class_name: "BUS 9",
    class_title: "Intellectual Property for the Entrepreneur 3 units"
  },
  {
    class_number: "1348",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Combs G E",
    class_name: "BUS 15",
    class_title: "Introduction to Insurance with Code and Ethics 2 units"
  },
  {
    class_number: "1349",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Combs G E",
    class_name: "BUS 17",
    class_title: "Property and Liability Insurance 3 units"
  },
  {
    class_number: "1350",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Combs G E",
    class_name: "BUS 18",
    class_title: "Commercial Insurance 3 units"
  },
  {
    class_number: "1351",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "BUS 252",
    class_instructor: "Rockwell C",
    class_name: "BUS 20",
    class_title: "Principles of Marketing 3 units"
  },
  {
    class_number: "1358",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUS 207",
    class_instructor: "Ivas L",
    class_name: "BUS 21",
    class_title: "Merchandising Principles 3 units"
  },
  {
    class_number: "1359",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Coplen J S",
    class_name: "BUS 22",
    class_title: "Introduction to Advertising 3 units"
  },
  {
    class_number: "1360",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "BUS 207",
    class_instructor: "Paccioretti T S",
    class_name: "BUS 23",
    class_title: "Principles of Selling 3 units"
  },
  {
    class_number: "1363",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "BUS 106",
    class_instructor: "Alexander J S",
    class_name: "BUS 26",
    class_title: "Marketing Research and Consumer Behavior 3 units"
  },
  {
    class_number: "1364",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Coplen J S",
    class_name: "BUS 27",
    class_title: "Introduction to e-Commerce 3 units"
  },
  {
    class_number: "4049",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "BUS 106",
    class_instructor: "Adelman A",
    class_name: "BUS 28",
    class_title: "Marketing Promotion 3 units"
  },
  {
    class_number: "4050",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "CMD 205",
    class_instructor: "Adelman A",
    class_name: "BUS 29",
    class_title: "Public Relations and Publicity 3 units"
  },
  {
    class_number: "1365",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "BUS 252",
    class_instructor: "Paik R",
    class_name: "BUS 31",
    class_title: "Business English Fundamentals 3 units"
  },
  {
    class_number: "1367",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUS 252",
    class_instructor: "Paik R",
    class_name: "BUS 32",
    class_title: "Business Communications 3 units"
  },
  {
    class_number: "4051",
    class_time: "5:30 p.m.  -  9:50 p.m. Th",
    class_location: "CMD 209",
    class_instructor: "Adelman A",
    class_name: "BUS 33",
    class_title: "Broadcast Advertising 3 units"
  },
  {
    class_number: "1376",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "BUS 106",
    class_instructor: "Staff",
    class_name: "BUS 34",
    class_title: "Introduction to Social Media Marketing 3 units"
  },
  {
    class_number: "3591",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Staff",
    class_name: "BUS 35",
    class_title: "Customer Relationship Management 3 units"
  },
  {
    class_number: "1379",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 207",
    class_instructor: "Resnick W J",
    class_name: "BUS 45",
    class_title: "Individual Financial Planning 3 units"
  },
  {
    class_number: "1386",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Shishido K M",
    class_name: "BUS 46",
    class_title: "Introduction to Investments 3 units"
  },
  {
    class_number: "1387",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lu M",
    class_name: "BUS 47",
    class_title: "Understanding Money for Lifelong Success 1 unit"
  },
  {
    class_number: "1391",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "BUS 252",
    class_instructor: "Welton M",
    class_name: "BUS 51",
    class_title: "Intercultural Business Communication 3 units"
  },
  {
    class_number: "1392",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rodriguez K P",
    class_name: "BUS 52",
    class_title: "International Marketing 3 units"
  },
  {
    class_number: "1393",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rodriguez K P",
    class_name: "BUS 53",
    class_title: "Importing and Exporting 3 units"
  },
  {
    class_number: "1394",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "BUS 207",
    class_instructor: "Everett K M",
    class_name: "BUS 54",
    class_title: "International Management 3 units"
  },
  {
    class_number: "4446",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "BUS 207",
    class_instructor: "Paccioretti T S",
    class_name: "BUS 59",
    class_title: "Design for Delight for the Entrepreneur 3 units"
  },
  {
    class_number: "1395",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Babcock L G",
    class_name: "BUS 62",
    class_title: "Human Relations and Ethical Issues in Business 3 units"
  },
  {
    class_number: "1396",
    class_time: "9 a.m. - 12:05 p.m. S",
    class_location: "BUS 207",
    class_instructor: "Paccioretti T S",
    class_name: "BUS 63",
    class_title: "Principles of Entrepreneurship 3 units"
  },
  {
    class_number: "1399",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rockwell C",
    class_name: "BUS 65",
    class_title: "Management Principles 3 units"
  },
  {
    class_number: "4056",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "BUS 252",
    class_instructor: "Hunter R T",
    class_name: "BUS 79",
    class_title: "Bargaining and Negotiations 3 units"
  },
  {
    class_number: "1400",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "BUS 207",
    class_instructor: "Rodriguez K P",
    class_name: "BUS 80",
    class_title: "Principles of Logistics 3 units"
  },
  {
    class_number: "1401",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rogers T A",
    class_name: "BUS 81",
    class_title: "Transportation Management 3 units"
  },
  {
    class_number: "1402",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Everett K M",
    class_name: "BUS 82",
    class_title: "Supply Chain Management 3 units"
  },
  {
    class_number: "1403",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Rodriguez K P",
    class_name: "BUS 84",
    class_title: "Introduction to Procurement 3 units"
  },
  {
    class_number: "1404",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "BUS 207",
    class_instructor: "Everett K M",
    class_name: "BUS 85",
    class_title: "Project Management Global Trade and Logistics 3 units"
  },
  {
    class_number: "1405",
    class_time: "Arrange  -  1 Hour ",
    class_location: "BUS 220D",
    class_instructor: "Veas S",
    class_name: "BUS 88A",
    class_title: "Independent Studies in Business 1 unit"
  },
  {
    class_number: "1406",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUS 220D",
    class_instructor: "Veas S",
    class_name: "BUS 88B",
    class_title: "Independent Studies in Business 2 units"
  },
  {
    class_number: "9808",
    class_time: "11 a.m. - 12:50 p.m. F",
    class_location: "EC 1227 208",
    class_instructor: "Frech H A",
    class_name: "OCC E00",
    class_title: "Basic Computer Training (formerly Introduction to Computers)"
  },
  {
    class_number: "9809",
    class_time: "11 a.m. - 12:50 p.m. M",
    class_location: "EC 1227 208",
    class_instructor: "Woolen D W",
    class_name: "OCC E01",
    class_title: "Word Processing"
  },
  {
    class_number: "9811",
    class_time: "11 a.m. - 12:50 p.m. T",
    class_location: "EC 1227 208",
    class_instructor: "Rodriguez J E",
    class_name: "OCC E10",
    class_title: "Using Data Files"
  },
  {
    class_number: "9813",
    class_time: "9 a.m. - 10:50 a.m. M",
    class_location: "EC 1227 208",
    class_instructor: "Woolen D W",
    class_name: "OCC E20",
    class_title: "Using the Internet Safely"
  },
  {
    class_number: "9816",
    class_time: "9 a.m. - 10:50 a.m. T",
    class_location: "EC 1227 409",
    class_instructor: "Schneir G",
    class_name: "PHOTO E00",
    class_title: "Digital Photography I"
  },
  {
    class_number: "9817",
    class_time: "9 a.m. - 10:50 a.m. T",
    class_location: "EC 1227 208",
    class_instructor: "Rodriguez J E",
    class_name: "PHOTO E10",
    class_title: "Digital Photography II"
  },
  {
    class_number: "7003",
    class_time: "9 a.m. - 12 p.m. F",
    class_location: "BUNDY 240",
    class_instructor: "Mikolajczak M",
    class_name: "BUS 901",
    class_title: "Introduction to Business - Basic 0 units"
  },
  {
    class_number: "7004",
    class_time: "9 a.m. - 12 p.m. F",
    class_location: "BUNDY 440",
    class_instructor: "Mikolajczak M",
    class_name: "BUS 902",
    class_title: "Introduction to Business Mindset 0 units"
  },
  {
    class_number: "7005",
    class_time: "6 p.m.  -  9 p.m. Th",
    class_location: "BUNDY 236",
    class_instructor: "Mumba A I",
    class_name: "BUS 911",
    class_title: "Customer Service Level 1 0 units"
  },
  {
    class_number: "7006",
    class_time: "6 p.m.  -  9 p.m. Th",
    class_location: "BUNDY 236",
    class_instructor: "Mumba A I",
    class_name: "BUS 912",
    class_title: "Customer Service Level 2 0 units"
  },
  {
    class_number: "1407",
    class_time: "10 a.m. - 12:15 p.m. MW",
    class_location: "SCI 157",
    class_instructor: "Wong W W",
    class_name: "CHEM 9",
    class_title: "Everyday Chemistry 5 units"
  },
  {
    class_number: "1411",
    class_time: "8 a.m. - 10:15 a.m. TTh",
    class_location: "SCI 153",
    class_instructor: "Jahanbakhsh S V",
    class_name: "CHEM 10",
    class_title: "Introductory General Chemistry 5 units"
  },
  {
    class_number: "1431",
    class_time: "7:45 a.m. - 10:15 a.m. MW",
    class_location: "SCI 153",
    class_instructor: "Lichtscheidl A",
    class_name: "CHEM 11",
    class_title: "General Chemistry I 5 units"
  },
  {
    class_number: "1442",
    class_time: "8:30 a.m. - 11 a.m. TTh",
    class_location: "SCI 140",
    class_instructor: "Murphy J E",
    class_name: "CHEM 12",
    class_title: "General Chemistry II 5 units"
  },
  {
    class_number: "1449",
    class_time: "7:30 a.m.  -  9:45 a.m. MW",
    class_location: "SCI 140",
    class_instructor: "Pecorelli T A",
    class_name: "CHEM 19",
    class_title:
      "Fundamentals of General, Organic, and Biological Chemistry 5 units"
  },
  {
    class_number: "1454",
    class_time: "12:45 p.m.  -  3:15 p.m. TTh",
    class_location: "SCI 155",
    class_instructor: "Bautista M R",
    class_name: "CHEM 21",
    class_title: "Organic Chemistry I 5 units"
  },
  {
    class_number: "1458",
    class_time: "7:45 a.m. - 10:15 a.m. MW",
    class_location: "SCI 155",
    class_instructor: "Anderson Jamey L",
    class_name: "CHEM 22",
    class_title: "Organic Chemistry II 4 units"
  },
  {
    class_number: "1459",
    class_time: "7:15 a.m. - 12:20 p.m. F",
    class_location: "SCI 305",
    class_instructor: "Anderson Jamey L",
    class_name: "CHEM 24",
    class_title: "Organic Chemistry II Laboratory 2 units"
  },
  {
    class_number: "1461",
    class_time: "10:45 a.m.  -  1:15 p.m. MW",
    class_location: "SCI 155",
    class_instructor: "Villarama R",
    class_name: "CHEM 31",
    class_title: "Biochemistry I 5 units"
  },
  {
    class_number: "1462",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Nauli S",
    class_name: "CHEM 88A",
    class_title: "Independent Studies in Chemistry 1 unit"
  },
  {
    class_number: "1463",
    class_time: "Arrange - TIME ",
    class_location: " ",
    class_instructor: "Nauli S",
    class_name: "CHEM 88B",
    class_title: "Independent Studies in Chemistry 2 units"
  },
  {
    class_number: "1464",
    class_time: "11:10 a.m. - 12:40 p.m. MWF",
    class_location: "DRSCHR 213",
    class_instructor: "Wu X",
    class_name: "CHNESE 1",
    class_title: "Elementary Chinese 1 5 units"
  },
  {
    class_number: "4073",
    class_time: "5 p.m.  -  7:25 p.m. MW",
    class_location: "DRSCHR 221",
    class_instructor: "Wu X",
    class_name: "CHNESE 2",
    class_title: "Elementary Chinese 2 5 units"
  },
  {
    class_number: "1507",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "LS 105",
    class_instructor: "Grass N L",
    class_name: "COM ST 9",
    class_title: "Introduction to Communication Studies 3 units"
  },
  {
    class_number: "1509",
    class_time: "6:30 a.m.  -  7:50 a.m. MW",
    class_location: "LS 119",
    class_instructor: "Ogata D K",
    class_name: "COM ST 11",
    class_title: "Elements of Public Speaking 3 units"
  },
  {
    class_number: "1547",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "CMD 128",
    class_instructor: "Ruh C",
    class_name: "COM ST 12",
    class_title: "Persuasion 3 units"
  },
  {
    class_number: "1548",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "LS 105",
    class_instructor: "Fox N M",
    class_name: "COM ST 16",
    class_title: "Fundamentals of Small Group Discussion 3 units"
  },
  {
    class_number: "1553",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "MC 9",
    class_instructor: "Chekroun Ju C",
    class_name: "COM ST 21",
    class_title: "Argumentation 3 units"
  },
  {
    class_number: "1561",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "LS 106",
    class_instructor: "Brown N A",
    class_name: "COM ST 22",
    class_title: "Introduction to Competitive Speech and Debate 2 units"
  },
  {
    class_number: "1562",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "LS 105",
    class_instructor: "Broccard D",
    class_name: "COM ST 30",
    class_title: "Introduction to Communication Theory 3 units"
  },
  {
    class_number: "1563",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "LS 119",
    class_instructor: "Ogata D K",
    class_name: "COM ST 35",
    class_title: "Interpersonal Communication 3 units"
  },
  {
    class_number: "1576",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Broccard D",
    class_name: "COM ST 36",
    class_title: "Gender and Communication 3 units"
  },
  {
    class_number: "1577",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "LA 236",
    class_instructor: "Sadeghi-Tabrizi F",
    class_name: "COM ST 37",
    class_title: "Intercultural Communication 3 units"
  },
  {
    class_number: "5001",
    class_time: "12 p.m.  -  3:05 p.m. W",
    class_location: "CMD 271",
    class_instructor: "Andrade L M",
    class_name: "COM ST 310",
    class_title: "Organizational and Small Group Communication 3 units"
  },
  {
    class_number: "1467",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "BUS 255",
    class_instructor: "Clark G B",
    class_name: "CIS 1",
    class_title: "Introduction to Computer Information Systems 3 units"
  },
  {
    class_number: "1476",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUS 255",
    class_instructor: "Clark G B",
    class_name: "CIS 4",
    class_title: "Business Information Systems with Applications 3 units"
  },
  {
    class_number: "1485",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CIS 9A",
    class_title: "Technology Project Management I 3 units"
  },
  {
    class_number: "1486",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CIS 9B",
    class_title: "Technology Project Management II 3 units"
  },
  {
    class_number: "1487",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolandhemat F",
    class_name: "CIS 30",
    class_title: "Microsoft Excel 3 units"
  },
  {
    class_number: "1489",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "El-Khoury N R",
    class_name: "CIS 32",
    class_title: "Microsoft Access 3 units"
  },
  {
    class_number: "1490",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "CIS 35A",
    class_title: "QuickBooks Desktop 3 units"
  },
  {
    class_number: "1491",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "CIS 35B",
    class_title: "QuickBooks Online 3 units"
  },
  {
    class_number: "1492",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Jerry G S",
    class_name: "CIS 37",
    class_title: "Microsoft Word 3 units"
  },
  {
    class_number: "1493",
    class_time: "9 a.m. - 12:05 p.m. F",
    class_location: "BUS 253",
    class_instructor: "Valdivia O",
    class_name: "CIS 38",
    class_title: "Microsoft PowerPoint 3 units"
  },
  {
    class_number: "1494",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Jerry G S",
    class_name: "CIS 39",
    class_title: "MS Outlook - Comprehensive Course 3 units"
  },
  {
    class_number: "1495",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolandhemat F",
    class_name: "CIS 50",
    class_title: "Internet, HTML, and Web Design 3 units"
  },
  {
    class_number: "1496",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolandhemat F",
    class_name: "CIS 51",
    class_title: "HTML5, CSS3, and Accessibility 3 units"
  },
  {
    class_number: "1497",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Clark G B",
    class_name: "CIS 54",
    class_title: "Web Development and Scripting 3 units"
  },
  {
    class_number: "1498",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "El-Khoury N R",
    class_name: "CIS 59A",
    class_title: "Dreamweaver I 3 units"
  },
  {
    class_number: "1499",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "CIS 60A",
    class_title: "Photoshop I 3 units"
  },
  {
    class_number: "1500",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Valdivia O",
    class_name: "CIS 60B",
    class_title: "Photoshop II 3 units"
  },
  {
    class_number: "1501",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Chaban M",
    class_name: "CIS 67",
    class_title: "WordPress 3 units"
  },
  {
    class_number: "1502",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "BUS 203",
    class_instructor: "Rothaupt B L",
    class_name: "CIS 70",
    class_title: "Social Media Applications 3 units"
  },
  {
    class_number: "1504",
    class_time: "Arrange  -  1 Hour ",
    class_location: "BUS 220G",
    class_instructor: "Stahl H A",
    class_name: "CIS 88A",
    class_title: "Independent Studies in CIS 1 unit"
  },
  {
    class_number: "1506",
    class_time: "Arrange  -  4 Hours ",
    class_location: "BUS 220G",
    class_instructor: "Stahl H A",
    class_name: "CIS 90A",
    class_title: "Internship in Computer Applications 1 unit"
  },
  {
    class_number: "1742",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "BUS 203",
    class_instructor: "Supat W",
    class_name: "CS 3",
    class_title: "Introduction to Computer Systems 3 units"
  },
  {
    class_number: "1750",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "BUS 250",
    class_instructor: "Seno V T",
    class_name: "CS 7",
    class_title: "Programming for Non-Computer Science Majors 3 units"
  },
  {
    class_number: "1751",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CS 9A",
    class_title: "Technology Project Management I 3 units"
  },
  {
    class_number: "1752",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CS 9B",
    class_title: "Technology Project Management II 3 units"
  },
  {
    class_number: "1753",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolandhemat F",
    class_name: "CS 15",
    class_title: "Visual Basic Programming 3 units"
  },
  {
    class_number: "1755",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Stahl H A",
    class_name: "CS 17",
    class_title: "Assembly Language Programming 3 units"
  },
  {
    class_number: "1756",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolandhemat F",
    class_name: "CS 19",
    class_title: "Advanced Visual Basic Programming 3 units"
  },
  {
    class_number: "4097",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "BUS 253",
    class_instructor: "Nguyen L V",
    class_name: "CS 20A",
    class_title: "Data Structures with C++ 3 units"
  },
  {
    class_number: "4100",
    class_time: "6:45 p.m.  -  9:50 p.m. F",
    class_location: "BUS 253",
    class_instructor: "Su J C",
    class_name: "CS 20B",
    class_title: "Data Structures with Java 3 units"
  },
  {
    class_number: "1757",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "BUS 253",
    class_instructor: "Bishop M S",
    class_name: "CS 30",
    class_title: "MATLAB Programming 3 units"
  },
  {
    class_number: "4101",
    class_time: "6:45 p.m.  -  9:50 p.m. Th",
    class_location: "BUS 263",
    class_instructor: "Morgan D B",
    class_name: "CS 40",
    class_title: "Operating Systems 3 units"
  },
  {
    class_number: "4102",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "BUS 201",
    class_instructor: "Kurtz K A",
    class_name: "CS 42",
    class_title: "Digital Logic 3 units"
  },
  {
    class_number: "1758",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "BUS 201",
    class_instructor: "Darwiche J",
    class_name: "CS 50",
    class_title: "C Programming 3 units"
  },
  {
    class_number: "1764",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "BUS 253",
    class_instructor: "Bishop M S",
    class_name: "CS 52",
    class_title: "C++ Programming 3 units"
  },
  {
    class_number: "4106",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "BUS 203",
    class_instructor: "Dehkhoda A",
    class_name: "CS 53B",
    class_title: "iOS Mobile App Development 3 units"
  },
  {
    class_number: "1768",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 201",
    class_instructor: "Dehkhoda A",
    class_name: "CS 55",
    class_title: "Java Programming 3 units"
  },
  {
    class_number: "1770",
    class_time: "9 a.m. - 12:05 p.m. F",
    class_location: "BUS 259",
    class_instructor: "Dehkhoda A",
    class_name: "CS 56",
    class_title: "Advanced Java Programming 3 units"
  },
  {
    class_number: "4108",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "BUS 259",
    class_instructor: "Sharma V D",
    class_name: "CS 60",
    class_title: "Database Concepts and Applications 3 units"
  },
  {
    class_number: "1771",
    class_time: "9 a.m. - 12:05 p.m. S",
    class_location: "BUS 263",
    class_instructor: "Morgan D B",
    class_name: "CS 70",
    class_title: "Network Fundamentals and Architecture 3 units"
  },
  {
    class_number: "1772",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CS 73A",
    class_title: "Fundamentals of Computer Security 3 units"
  },
  {
    class_number: "3450",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Corbin S L",
    class_name: "CS 73B",
    class_title: "Computer Forensics Fundamentals 3 units"
  },
  {
    class_number: "1773",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Seno V T",
    class_name: "CS 73C",
    class_title: "Cybersecurity and Ethical Hacking 3 units"
  },
  {
    class_number: "1774",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Darwiche J",
    class_name: "CS 77A",
    class_title: "Salesforce Administration Essentials 3 units"
  },
  {
    class_number: "1775",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Stahl H A",
    class_name: "CS 77B",
    class_title: "Salesforce Developer Essentials 3 units"
  },
  {
    class_number: "1776",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Kol K T",
    class_name: "CS 79A",
    class_title: "Introduction to Cloud Computing 3 units"
  },
  {
    class_number: "1778",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Samplewala M S",
    class_name: "CS 79B",
    class_title: "Database Essentials in Amazon Web Services 3 units"
  },
  {
    class_number: "1779",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Seno V T",
    class_name: "CS 79C",
    class_title: "Compute Engines in Amazon Web Services 3 units"
  },
  {
    class_number: "1780",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Seno V T",
    class_name: "CS 79D",
    class_title: "Security in Amazon Web Services 3 units"
  },
  {
    class_number: "1781",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Seno V T",
    class_name: "CS 79E",
    class_title: "Best Practices in Amazon Web Services 3 units"
  },
  {
    class_number: "1782",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Geddes Jr J K",
    class_name: "CS 80",
    class_title: "Internet Programming 3 units"
  },
  {
    class_number: "1784",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Wang An C",
    class_name: "CS 81",
    class_title: "JavaScript Programming 3 units"
  },
  {
    class_number: "1786",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Stahl H A",
    class_name: "CS 83R",
    class_title: "Server-Side Ruby Web Programming 3 units"
  },
  {
    class_number: "1787",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Seno V T",
    class_name: "CS 85",
    class_title: "PHP Programming 3 units"
  },
  {
    class_number: "1788",
    class_time: "8 a.m. - 11:05 a.m. T",
    class_location: "BUS 250",
    class_instructor: "Bishop M S",
    class_name: "CS 87A",
    class_title: "Python Programming 3 units"
  },
  {
    class_number: "1792",
    class_time: "Arrange  -  1 Hour ",
    class_location: "BUS 220G",
    class_instructor: "Stahl H A",
    class_name: "CS 88A",
    class_title: "Independent Studies in Computer Science 1 unit"
  },
  {
    class_number: "1793",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUS 220G",
    class_instructor: "Stahl H A",
    class_name: "CS 88B",
    class_title: "Independent Studies in Computer Science 2 units"
  },
  {
    class_number: "1794",
    class_time: "Arrange  -  3 Hours ",
    class_location: "BUS 220G",
    class_instructor: "Stahl H A",
    class_name: "CS 88C",
    class_title: "Independent Studies in Computer Science 3 units"
  },
  {
    class_number: "1795",
    class_time: "Arrange  -  4 Hours ",
    class_location: " ",
    class_instructor: "Stahl H A",
    class_name: "CS 90A",
    class_title: "Internship in Computer Science 1 unit"
  },
  {
    class_number: "1796",
    class_time: "Arrange  -  8 Hours ",
    class_location: " ",
    class_instructor: "Stahl H A",
    class_name: "CS 90B",
    class_title: "Internship in Computer Science 2 units"
  },
  {
    class_number: "1581",
    class_time: "8 a.m. - 12:05 p.m. M",
    class_location: "BUS 143B",
    class_instructor: "Horn S L",
    class_name: "COSM 10A",
    class_title: "Related Science 1A 1 unit"
  },
  {
    class_number: "1583",
    class_time: "12:30 p.m.  -  4:35 p.m. M",
    class_location: "BUS 143B",
    class_instructor: "Manuel S M",
    class_name: "COSM 10B",
    class_title: "Related Science 1B 1 unit"
  },
  {
    class_number: "1585",
    class_time: "8 a.m. - 12:05 p.m. Th",
    class_location: "BUS 143B",
    class_instructor: "Ledonne H",
    class_name: "COSM 11A",
    class_title: "Hair Cutting 1 0.5 unit"
  },
  {
    class_number: "1587",
    class_time: "8 a.m. - 12:05 p.m. W",
    class_location: "BUS 143B",
    class_instructor: "Perret D M",
    class_name: "COSM 11B",
    class_title: "Hair Styling 1 0.5 unit"
  },
  {
    class_number: "1589",
    class_time: "12:30 p.m.  -  4:35 p.m. W",
    class_location: "BUS 143B",
    class_instructor: "Assadi J",
    class_name: "COSM 11C",
    class_title: "Hair Coloring 1 0.5 unit"
  },
  {
    class_number: "1591",
    class_time: "12:30 p.m.  -  4:35 p.m. Th",
    class_location: "BUS 143E",
    class_instructor: "Moisan A V",
    class_name: "COSM 11D",
    class_title: "Permanent Wave 1 0.5 unit"
  },
  {
    class_number: "1593",
    class_time: "8 a.m. - 12:05 p.m. F",
    class_location: "BUS 143B",
    class_instructor: "Myers A M",
    class_name: "COSM 11E",
    class_title: "Curly Hair Techniques 1 0.5 unit"
  },
  {
    class_number: "1595",
    class_time: "8 a.m. - 12:05 p.m. T",
    class_location: "BUS 143C",
    class_instructor: "Nunley R M",
    class_name: "COSM 16",
    class_title: "Nail Care 1 0.5 unit"
  },
  {
    class_number: "1597",
    class_time: "12:30 p.m.  -  4:35 p.m. T",
    class_location: "BUS 143D",
    class_instructor: "Lim J Y",
    class_name: "COSM 18",
    class_title: "Skin Care 1 0.5 unit"
  },
  {
    class_number: "1599",
    class_time: "12:30 p.m.  -  3:35 p.m. F",
    class_location: "BUS 143C",
    class_instructor: "Myers A M",
    class_name: "COSM 20",
    class_title: "Related Science 2 1 unit"
  },
  {
    class_number: "1601",
    class_time: "8 a.m. - 12:05 p.m. T",
    class_location: "BUS 143E",
    class_instructor: "Moisan A V",
    class_name: "COSM 21A",
    class_title: "Hair Cutting 2 0.5 unit"
  },
  {
    class_number: "1603",
    class_time: "12:30 p.m.  -  4:35 p.m. T",
    class_location: "BUS 143B",
    class_instructor: "Manuel S M",
    class_name: "COSM 21B",
    class_title: "Hair Styling 2 0.5 unit"
  },
  {
    class_number: "1605",
    class_time: "12:30 p.m.  -  4:35 p.m. W",
    class_location: "BUS 143E",
    class_instructor: "Perret D M",
    class_name: "COSM 21C",
    class_title: "Hair Coloring 2 0.5 unit"
  },
  {
    class_number: "1607",
    class_time: "8 a.m. - 12:05 p.m. F",
    class_location: "BUS 143E",
    class_instructor: "Harrison H L",
    class_name: "COSM 21D",
    class_title: "Permanent Waving 2 0.5 unit"
  },
  {
    class_number: "1609",
    class_time: "12:30 p.m.  -  4:35 p.m. F",
    class_location: "BUS 143B",
    class_instructor: "Monge J V",
    class_name: "COSM 21E",
    class_title: "Curly Hair Techniques 2 0.5 units"
  },
  {
    class_number: "1611",
    class_time: "8 a.m. - 12:05 p.m. W",
    class_location: "BUS 143C",
    class_instructor: "Nunley R M",
    class_name: "COSM 26",
    class_title: "Nail Care 2 0.5 unit"
  },
  {
    class_number: "1613",
    class_time: "8 a.m. - 12:05 p.m. W",
    class_location: "BUS 143D",
    class_instructor: "Ledonne H",
    class_name: "COSM 28A",
    class_title: "Skin Care 2A 0.5 unit"
  },
  {
    class_number: "1615",
    class_time: "12:30 p.m.  -  4:35 p.m. W",
    class_location: "BUS 143D",
    class_instructor: "Lim J Y",
    class_name: "COSM 28B",
    class_title: "Skin Care 2B 0.5 unit"
  },
  {
    class_number: "1617",
    class_time: "12:30 p.m.  -  3:35 p.m. T",
    class_location: "BUS 143C",
    class_instructor: "Dicamillo N",
    class_name: "COSM 30",
    class_title: "Related Science 3 1 unit"
  },
  {
    class_number: "1619",
    class_time: "12:30 p.m.  -  4:35 p.m. M",
    class_location: "BUS 143E",
    class_instructor: "Monge J V",
    class_name: "COSM 31A",
    class_title: "Hair Cutting 3 0.5 unit"
  },
  {
    class_number: "1621",
    class_time: "12:30 p.m.  -  4:35 p.m. Th",
    class_location: "BUS 143E",
    class_instructor: "Assadi J",
    class_name: "COSM 31B",
    class_title: "Hair Styling 3 0.5 unit"
  },
  {
    class_number: "1622",
    class_time: "8 a.m. - 12:05 p.m. W",
    class_location: "BUS 143E",
    class_instructor: "Ceballos B A",
    class_name: "COSM 31C",
    class_title: "Hair Coloring 3 0.5 unit"
  },
  {
    class_number: "1623",
    class_time: "12:30 p.m.  -  4:35 p.m. Th",
    class_location: "BUS 143B",
    class_instructor: "Assadi J",
    class_name: "COSM 31E",
    class_title: "Curly Hair Techniques 3 0.5 unit"
  },
  {
    class_number: "1624",
    class_time: "8 a.m. - 12:05 p.m. Th",
    class_location: "BUS 143C",
    class_instructor: "Nunley R M",
    class_name: "COSM 36",
    class_title: "Nail Care 3 0.5 unit"
  },
  {
    class_number: "1626",
    class_time: "8 a.m. - 12:05 p.m. T",
    class_location: "BUS 143D",
    class_instructor: "Lim J Y",
    class_name: "COSM 38",
    class_title: "Skin Care 3 0.5 unit"
  },
  {
    class_number: "1628",
    class_time: "8 a.m. - 12:05 p.m. M",
    class_location: "BUS 143D",
    class_instructor: "Ijames S V",
    class_name: "COSM 38B",
    class_title: "Mechanical Exfoliation 0.5 unit"
  },
  {
    class_number: "1630",
    class_time: "12:30 p.m.  -  4:35 p.m. M",
    class_location: "BUS 143D",
    class_instructor: "Ijames S V",
    class_name: "COSM 38C",
    class_title: "Chemical Exfoliation 0.5 unit"
  },
  {
    class_number: "1632",
    class_time: "12:30 p.m.  -  3:30 p.m. Th",
    class_location: "BUS 250",
    class_instructor: "Dicamillo N",
    class_name: "COSM 40",
    class_title: "Related Science 4 1 unit"
  },
  {
    class_number: "1633",
    class_time: "8 a.m. - 12:05 p.m. Th",
    class_location: "BUS 143E",
    class_instructor: "Monge J V",
    class_name: "COSM 41B",
    class_title: "Hair Styling 4 0.5 unit"
  },
  {
    class_number: "1634",
    class_time: "8 a.m. - 12:05 p.m. M",
    class_location: "BUS 143F",
    class_instructor: "Harrison H L",
    class_name: "COSM 42",
    class_title: "Men's Hair Styling 0.5 unit"
  },
  {
    class_number: "1636",
    class_time: "8 a.m. - 12:05 p.m. F",
    class_location: "BUS 143C",
    class_instructor: "Monge J V",
    class_name: "COSM 46",
    class_title: "Nail Care 4 0.5 unit"
  },
  {
    class_number: "1637",
    class_time: "8 a.m. - 12:05 p.m. Th",
    class_location: "BUS 143D",
    class_instructor: "Kepler J M",
    class_name: "COSM 48",
    class_title: "Skin Care 4 0.5 unit"
  },
  {
    class_number: "1639",
    class_time: "12:30 p.m.  -  4:35 p.m. Th",
    class_location: "BUS 143D",
    class_instructor: "Ledonne H",
    class_name: "COSM 48B",
    class_title: "Advanced Make-Up 0.5 unit"
  },
  {
    class_number: "1641",
    class_time: "8 a.m. - 12:05 p.m. F",
    class_location: "BUS 143C",
    class_instructor: "Moisan A V",
    class_name: "COSM 50A",
    class_title: "Related Science 5 2 units"
  },
  {
    class_number: "1642",
    class_time: "8 a.m. - 12 p.m. M",
    class_location: "BUS 143E",
    class_instructor: "Ceballos B A",
    class_name: "COSM 50B",
    class_title: "Practical Preparation for State Board Exam 1.5 units"
  },
  {
    class_number: "1643",
    class_time: "8 a.m. - 11:05 a.m. W",
    class_location: "BUS 250",
    class_instructor: "Dicamillo N",
    class_name: "COSM 50C",
    class_title: "Written Preparation for State Board Exam 1 unit"
  },
  {
    class_number: "1646",
    class_time: "8 a.m. - 11:05 a.m. W",
    class_location: "BUS 250",
    class_instructor: "Dicamillo N",
    class_name: "COSM 50E",
    class_title: "Written Preparation for Esthetician State Board Exam 1 unit"
  },
  {
    class_number: "1649",
    class_time: "8 a.m. - 11:05 a.m. W",
    class_location: "BUS 250",
    class_instructor: "Dicamillo N",
    class_name: "COSM 50N",
    class_title: "Written Preparation for Nail Care State Board Exam 1 unit"
  },
  {
    class_number: "1652",
    class_time: "8 a.m. - 12:05 p.m. T",
    class_location: "BUS 143B",
    class_instructor: "Ledonne H",
    class_name: "COSM 64",
    class_title: "Salon Management 2 units"
  },
  {
    class_number: "1654",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUS 143",
    class_instructor: "Perret D M",
    class_name: "COSM 88A",
    class_title: "Independent Studies in Cosmetology 1 unit"
  },
  {
    class_number: "1656",
    class_time: "Arrange  -  6 Hours ",
    class_location: "BUS 143F",
    class_instructor: "Moisan A V",
    class_name: "COSM 95A",
    class_title: "Salon Experience 1 unit"
  },
  {
    class_number: "1657",
    class_time: "Arrange - 12 Hours ",
    class_location: "BUS 143F",
    class_instructor: "Ledonne H",
    class_name: "COSM 95B",
    class_title: "Salon Experience 2 units"
  },
  {
    class_number: "1658",
    class_time: "Arrange - 18 Hours ",
    class_location: "BUS 143F",
    class_instructor: "Moisan A V",
    class_name: "COSM 95C",
    class_title: "Salon Experience 3 units"
  },
  {
    class_number: "1659",
    class_time: "Arrange - 24 Hours ",
    class_location: "BUS 143F",
    class_instructor: "Perret D M",
    class_name: "COSM 95D",
    class_title: "Salon Experience 4 units"
  },
  {
    class_number: "1660",
    class_time: "11:15 a.m.  -  1:20 p.m. F",
    class_location: "MC 6",
    class_instructor: "Finley S F",
    class_name: "COUNS 1",
    class_title: "Developing Learning Skills 1 unit"
  },
  {
    class_number: "1663",
    class_time: "11:15 a.m. - 12:20 p.m. F",
    class_location: "SSC 290",
    class_instructor: "Kim Soo",
    class_name: "COUNS 11",
    class_title: "Orientation to Higher Education 1 unit"
  },
  {
    class_number: "1668",
    class_time: "8:45 a.m. - 10:50 a.m. F",
    class_location: "SSC 290",
    class_instructor: "Ruiz J",
    class_name: "COUNS 12",
    class_title: "Career Planning 1 unit"
  },
  {
    class_number: "1687",
    class_time: "3:45 p.m.  -  5:50 p.m. M",
    class_location: "SSC 291",
    class_instructor: "Kennison R L",
    class_name: "COUNS 15",
    class_title: "Job Search Techniques 1 unit"
  },
  {
    class_number: "1689",
    class_time: "6:30 a.m.  -  7:50 a.m. MW",
    class_location: "MC 14",
    class_instructor: "Galindo O A",
    class_name: "COUNS 20",
    class_title: "Student Success Seminar 3 units"
  },
  {
    class_number: "1720",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ONLINE",
    class_instructor: "Lu M",
    class_name: "COUNS 47",
    class_title: "Understanding Money for Lifelong Success 1 unit"
  },
  {
    class_number: "1737",
    class_time: "Arrange  -  4 Hours ",
    class_location: "SSC 221",
    class_instructor: "Johnson De A",
    class_name: "COUNS 90A",
    class_title: "General Internship 1 unit"
  },
  {
    class_number: "1739",
    class_time: "Arrange  -  8 Hours ",
    class_location: "SSC 221",
    class_instructor: "Johnson De A",
    class_name: "COUNS 90B",
    class_title: "General Internship 2 units"
  },
  {
    class_number: "1740",
    class_time: "Arrange - 12 Hours ",
    class_location: "SSC 221",
    class_instructor: "Johnson De A",
    class_name: "COUNS 90C",
    class_title: "General Internship 3 units"
  },
  {
    class_number: "1741",
    class_time: "Arrange - 16 Hours ",
    class_location: "SSC 221",
    class_instructor: "Johnson De A",
    class_name: "COUNS 90D",
    class_title: "General Internship 4 units"
  },
  {
    class_number: "1685",
    class_time: "2:15 p.m.  -  4:20 p.m. Th",
    class_location: "SSC 291",
    class_instructor: "Adams J",
    class_name: "COUNS 12H",
    class_title: "Career Planning 1 unit"
  },
  {
    class_number: "1686",
    class_time: "2:15 p.m.  -  4:20 p.m. T",
    class_location: "SSC 291",
    class_instructor: "Pearce Mi",
    class_name: "COUNS 13H",
    class_title: "Personal and Social Awareness 1 unit"
  },
  {
    class_number: "1688",
    class_time: "2:15 p.m.  -  4:20 p.m. Th",
    class_location: "SSC 291",
    class_instructor: "Deuel E M",
    class_name: "COUNS 15H",
    class_title: "Job Search Techniques 1 unit"
  },
  {
    class_number: "1715",
    class_time: "Arrange  -  3 Hours ",
    class_location: "SSC 159",
    class_instructor: "Peters T M",
    class_name: "COUNS 21H",
    class_title: "Adapted Computer Technology 1 unit"
  },
  {
    class_number: "1716",
    class_time: "Arrange  -  3 Hours ",
    class_location: "SSC 159",
    class_instructor: "Peters T M",
    class_name: "COUNS 22H",
    class_title:
      "Adapted Computer Technology, Internet Skills for Academic Success 1 unit"
  },
  {
    class_number: "1717",
    class_time: "Arrange  -  2 Hours ",
    class_location: "SSC 159",
    class_instructor: "Peters T M",
    class_name: "COUNS 25H",
    class_title:
      "Adapted Computer Technology, Technology Tools for Academic Success 0.5 unit"
  },
  {
    class_number: "1718",
    class_time: "Arrange  -  3 Hours ",
    class_location: "SSC 159",
    class_instructor: "Peters T M",
    class_name: "COUNS 26",
    class_title: "Technology Literacy for Academic Success 1 unit"
  },
  {
    class_number: "1719",
    class_time: "11 a.m.  -  2 p.m. Th",
    class_location: "SSC 291",
    class_instructor: "Deuel E M",
    class_name: "COUNS 41H",
    class_title: "Independent Living Skills 2 units"
  },
  {
    class_number: "1724",
    class_time: "9:30 a.m. - 10:35 a.m. MW",
    class_location: "SSC 370A",
    class_instructor: "Feingold H",
    class_name: "COUNS 51",
    class_title: "Test Taking/Memory Strategies 1 unit"
  },
  {
    class_number: "1725",
    class_time: "9:30 a.m. - 10:35 a.m. MW",
    class_location: "SSC 370A",
    class_instructor: "Feingold H",
    class_name: "COUNS 52",
    class_title: "Textbook/Memory Strategies 1 unit"
  },
  {
    class_number: "1726",
    class_time: "9:30 a.m. - 10:30 a.m. T",
    class_location: "SSC 370A",
    class_instructor: "Teruya S",
    class_name: "COUNS 53",
    class_title: "Phonics, Spelling and Vocabulary Development 1 unit"
  },
  {
    class_number: "1727",
    class_time: "12:45 p.m.  -  1:50 p.m. TTh",
    class_location: "SSC 370A",
    class_instructor: "Axelrod L",
    class_name: "COUNS 54",
    class_title: "Organizing for College Success 1 unit"
  },
  {
    class_number: "1728",
    class_time: "12:45 p.m.  -  1:50 p.m. TTh",
    class_location: "SSC 370A",
    class_instructor: "Axelrod L",
    class_name: "COUNS 56",
    class_title: "Written Language Strategies 1 unit"
  },
  {
    class_number: "1729",
    class_time: "11:30 a.m. - 12:30 p.m. MW",
    class_location: "SSC 370A",
    class_instructor: "Teruya S",
    class_name: "COUNS 57",
    class_title: "Listening, Note Taking and Memory 1 unit"
  },
  {
    class_number: "1730",
    class_time: "12:45 p.m.  -  1:50 p.m. MW",
    class_location: "SSC 370A",
    class_instructor: "Marcopulos G E",
    class_name: "COUNS 58",
    class_title: "Math Strategies 1 unit"
  },
  {
    class_number: "1732",
    class_time: "12:45 p.m.  -  1:45 p.m. MW",
    class_location: "NONE 29",
    class_instructor: "Courto L",
    class_name: "COUNS 59",
    class_title: "Textbook Strategies Using Technology 1 unit"
  },
  {
    class_number: "7011",
    class_time: "1 p.m.  -  3:30 p.m. M",
    class_location: "BUNDY 216",
    class_instructor: "Laille N",
    class_name: "COUNS 910",
    class_title: "ABI Connections 0 units"
  },
  {
    class_number: "7007",
    class_time: "8 a.m.  -  9:30 a.m. MW",
    class_location: "BUNDY 119",
    class_instructor: "Torres-Gonzalez N A",
    class_name: "COUNS 901 ",
    class_title: "Transition to College 0 unit"
  },
  {
    class_number: "7008",
    class_time: "8 a.m.  -  9:30 a.m. MW",
    class_location: "BUNDY 440",
    class_instructor: "Torres-Gonzalez N A",
    class_name: "COUNS 902 ",
    class_title: "Career and Workforce Readiness 0 unit"
  },
  {
    class_number: "7009",
    class_time: "7 p.m.  -  9:05 p.m. T",
    class_location: "SSC 290",
    class_instructor: "Dana M",
    class_name: "COUNS 906",
    class_title: "American Sign Language Level 1 (Beginner) 0 units"
  },
  {
    class_number: "1798",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "HSS 165",
    class_instructor: "Susilowati S",
    class_name: "DANCE 2",
    class_title: "Dance in American Culture 3 units"
  },
  {
    class_number: "1800",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 103",
    class_instructor: "Wolin-Tupas R L",
    class_name: "DANCE 5",
    class_title: "Dance History 3 units"
  },
  {
    class_number: "1803",
    class_time: "8 a.m. - 10:05 a.m. MW",
    class_location: "CPC 310",
    class_instructor: "Aybay Owens S",
    class_name: "DANCE 10",
    class_title: "Fundamentals of Dance Technique 2 units"
  },
  {
    class_number: "1806",
    class_time: "8 a.m. - 10:05 a.m. TTh",
    class_location: "CPC 314",
    class_instructor: "Jordan A N",
    class_name: "DANCE 11",
    class_title: "Beginning Hip Hop Dance 2 units"
  },
  {
    class_number: "1810",
    class_time: "11 a.m.  -  1:05 p.m. MW",
    class_location: "CPC 314",
    class_instructor: "Moreno M O",
    class_name: "DANCE 12",
    class_title: "Intermediate Hip Hop Dance 2 units"
  },
  {
    class_number: "1811",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CPC 304",
    class_instructor: "Staff",
    class_name: "DANCE 15",
    class_title: "Intermediate Modern Jazz 1 unit"
  },
  {
    class_number: "1812",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "CPC 314",
    class_instructor: "Zee S L",
    class_name: "DANCE 17",
    class_title: "Beginning Tap 1 unit"
  },
  {
    class_number: "1813",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "CPC 314",
    class_instructor: "Zee S L",
    class_name: "DANCE 18",
    class_title: "Intermediate Tap 1 unit"
  },
  {
    class_number: "1814",
    class_time: "3:30 p.m.  -  5:35 p.m. MW",
    class_location: "CPC 308",
    class_instructor: "Susilowati S",
    class_name: "DANCE 21A",
    class_title: "Beginning Asian Pacific Dance 3 units"
  },
  {
    class_number: "3451",
    class_time: "3:30 p.m.  -  5:35 p.m. MW",
    class_location: "CPC 308",
    class_instructor: "Susilowati S",
    class_name: "DANCE 21B",
    class_title: "Intermediate Asian Pacific Dance 2 units"
  },
  {
    class_number: "1815",
    class_time: "4 p.m.  -  6:05 p.m. MW",
    class_location: "CPC 314",
    class_instructor: "Ramirez R V",
    class_name: "DANCE 22",
    class_title: "Mexican Dance 2 units"
  },
  {
    class_number: "1816",
    class_time: "4 p.m.  -  6:05 p.m. MW",
    class_location: "CPC 314",
    class_instructor: "Ramirez R V",
    class_name: "DANCE 23",
    class_title: "Intermediate Mexican Dance 2 units"
  },
  {
    class_number: "1817",
    class_time: "12:30 p.m.  -  2:50 p.m. TTh",
    class_location: "CPC 314",
    class_instructor: "Ocampo C",
    class_name: "DANCE 24",
    class_title: "Flamenco Dance 1 2 units"
  },
  {
    class_number: "1818",
    class_time: "3:45 p.m.  -  5:50 p.m. MW",
    class_location: "CPC 310",
    class_instructor: "Jordan A N",
    class_name: "DANCE 25",
    class_title: "African Dance 2 units"
  },
  {
    class_number: "1819",
    class_time: "3:45 p.m.  -  5:50 p.m. MW",
    class_location: "CPC 310",
    class_instructor: "Jordan A N",
    class_name: "DANCE 25B",
    class_title: "Intermediate African Dance 2 units"
  },
  {
    class_number: "1820",
    class_time: "1:15 p.m.  -  3:35 p.m. MW",
    class_location: "CPC 314",
    class_instructor: "Canellias L M",
    class_name: "DANCE 26A",
    class_title: "Beginning Salsa Dance 2 units"
  },
  {
    class_number: "1821",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "CPC 308",
    class_instructor: "Molnar Cy A",
    class_name: "DANCE 31",
    class_title: "Ballet I 1 unit"
  },
  {
    class_number: "1823",
    class_time: "9:30 a.m. - 11:35 a.m. TTh",
    class_location: "CPC 308",
    class_instructor: "Molnar Cy A",
    class_name: "DANCE 32",
    class_title: "Ballet 2 2 units"
  },
  {
    class_number: "1825",
    class_time: "10:15 a.m. - 12:20 p.m. MW",
    class_location: "CPC 308",
    class_instructor: "Gaydos S C",
    class_name: "DANCE 33",
    class_title: "Ballet 3 2 units"
  },
  {
    class_number: "1826",
    class_time: "10:15 a.m. - 12:20 p.m. MW",
    class_location: "CPC 308",
    class_instructor: "Gaydos S C",
    class_name: "DANCE 34",
    class_title: "Ballet 4 2 units"
  },
  {
    class_number: "1827",
    class_time: "10:15 a.m. - 12:15 p.m. MW",
    class_location: "CPC 304",
    class_instructor: "Van Wormer V M",
    class_name: "DANCE 35",
    class_title: "Ballet 5 2 units"
  },
  {
    class_number: "1828",
    class_time: "10:15 a.m. - 12:15 p.m. MW",
    class_location: "CPC 304",
    class_instructor: "Van Wormer V M",
    class_name: "DANCE 36",
    class_title: "Ballet 6 2 units"
  },
  {
    class_number: "1829",
    class_time: "8 a.m.  -  9:35 a.m. TTh",
    class_location: "CPC 304",
    class_instructor: "Staff",
    class_name: "DANCE 41",
    class_title: "Contemporary Modern Dance I 1 unit"
  },
  {
    class_number: "1831",
    class_time: "12 p.m.  -  2:20 p.m. TTh",
    class_location: "CPC 308",
    class_instructor: "Mcdonald K E",
    class_name: "DANCE 42",
    class_title: "Contemporary Modern Dance 2 2 units"
  },
  {
    class_number: "1832",
    class_time: "12:30 p.m.  -  2:35 p.m. TThF",
    class_location: "CPC 304",
    class_instructor: "Aybay Owens S",
    class_name: "DANCE 43",
    class_title: "Contemporary Modern Dance 3 2 units"
  },
  {
    class_number: "1833",
    class_time: "12:30 p.m.  -  2:35 p.m. TThF",
    class_location: "CPC 304",
    class_instructor: "Aybay Owens S",
    class_name: "DANCE 44",
    class_title: "Contemporary Modern Dance 4 2 units"
  },
  {
    class_number: "1834",
    class_time: "12:30 p.m.  -  2:35 p.m. TTh",
    class_location: "CPC 310",
    class_instructor: "Moreno M O",
    class_name: "DANCE 45",
    class_title: "Contemporary Modern Dance 5 2 units"
  },
  {
    class_number: "1835",
    class_time: "12:30 p.m.  -  2:35 p.m. TTh",
    class_location: "CPC 310",
    class_instructor: "Moreno M O",
    class_name: "DANCE 46",
    class_title: "Contemporary Modern Dance 6 2 units"
  },
  {
    class_number: "1836",
    class_time: "3 p.m.  -  7:30 p.m. TTh",
    class_location: "CPC 304",
    class_instructor: "Lee J Y",
    class_name: "DANCE 55A",
    class_title: "Dance Performance - Modern 3 units"
  },
  {
    class_number: "4112",
    class_time: "6:15 p.m.  -  9:45 p.m. MW",
    class_location: "CPC 314",
    class_instructor: "Susilowati S",
    class_name: "DANCE 57A",
    class_title: "World Dance Performance 3 units"
  },
  {
    class_number: "4442",
    class_time: "5:30 p.m.  -  7 p.m. W",
    class_location: " WST BLLT",
    class_instructor: "Gaydos S C",
    class_name: "DANCE 60",
    class_title: "Fundamentals of Choreography I 2 units"
  },
  {
    class_number: "1838",
    class_time: "1 p.m.  -  3:05 p.m. MW",
    class_location: "CPC 304",
    class_instructor: "Van Wormer V M",
    class_name: "DANCE 62",
    class_title: "Fundamentals of Choreography 3 2 units"
  },
  {
    class_number: "1839",
    class_time: "1 p.m.  -  3:05 p.m. MW",
    class_location: "CPC 304",
    class_instructor: "Van Wormer V M",
    class_name: "DANCE 63",
    class_title: "Fundamentals of Choreography 4 2 units"
  },
  {
    class_number: "1842",
    class_time: "Arrange  -  4 Hours ",
    class_location: " 105",
    class_instructor: "Lee J Y",
    class_name: "DANCE 70",
    class_title: "Dance Staging Technique 1 unit"
  },
  {
    class_number: "1844",
    class_time: "Arrange - 54 Hours ",
    class_location: " NEW YORK",
    class_instructor: "Van Wormer V M",
    class_name: "DANCE 79",
    class_title: "Dance Study Tour 1 unit"
  },
  {
    class_number: "1845",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Douglas Judith G",
    class_name: "DANCE 88A",
    class_title: "Independent Studies in Dance 1 unit"
  },
  {
    class_number: "1850",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Douglas Judith G",
    class_name: "DANCE 88B",
    class_title: "Independent Studies in Dance 2 units"
  },
  {
    class_number: "1855",
    class_time: "Arrange  -  8 Hours ",
    class_location: " ",
    class_instructor: "Wolin-Tupas R L",
    class_name: "DANCE 90B",
    class_title: "Internship in Dance 2 units"
  },
  {
    class_number: "4113",
    class_time: "6:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 280",
    class_instructor: "Louie W B",
    class_name: "DMPOST 1",
    class_title: "Digital Media Workflow Management 3 units"
  },
  {
    class_number: "1857",
    class_time: "9:30 a.m. - 12:35 p.m. M",
    class_location: "CMD 280",
    class_instructor: "Javelosa D A",
    class_name: "DMPOST 2",
    class_title: "Digital Audio Fundamentals 3 units"
  },
  {
    class_number: "1858",
    class_time: "9:30 a.m. - 12:35 p.m. T",
    class_location: "CMD 280",
    class_instructor: "Louie W B",
    class_name: "DMPOST 3",
    class_title: "Digital Video Fundamentals 3 units"
  },
  {
    class_number: "1859",
    class_time: "9 a.m. - 12:05 p.m. S",
    class_location: "CMD 280",
    class_instructor: "Platt H H",
    class_name: "DMPOST 20",
    class_title: "Digital Audio Editing 3 units"
  },
  {
    class_number: "1860",
    class_time: "9:30 a.m. - 12:35 p.m. W",
    class_location: "CMD 209",
    class_instructor: "Javelosa D A",
    class_name: "DMPOST 21",
    class_title: "Digital Audio for Games 3 units"
  },
  {
    class_number: "3452",
    class_time: "9:30 a.m. - 12:35 p.m. Th",
    class_location: "CMD 280",
    class_instructor: "Louie W B",
    class_name: "DMPOST 30",
    class_title: "Digital Video Editing 3 units"
  },
  {
    class_number: "4115",
    class_time: "6:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 207",
    class_instructor: "Uzan D",
    class_name: "DMPOST 31",
    class_title: "Digital Compositing 3 units"
  },
  {
    class_number: "1861",
    class_time: "11:30 a.m.  -  2:35 p.m. MW",
    class_location: "BUNDY 339",
    class_instructor: "Elam E J",
    class_name: "ECE 2",
    class_title: "Principles and Practices of Teaching Young Children 3 units"
  },
  {
    class_number: "4117",
    class_time: "6:30 p.m.  -  9:35 p.m. M",
    class_location: "BUNDY 339",
    class_instructor: "Lopez Je",
    class_name: "ECE 4",
    class_title: "Language and Literature for the Young Child 3 units"
  },
  {
    class_number: "1864",
    class_time: "11:30 a.m.  -  2:35 p.m. MW",
    class_location: "BUNDY 339",
    class_instructor: "Elam E J",
    class_name: "ECE 8",
    class_title: "Creative Experiences - Art, Music, and Movement 3 units"
  },
  {
    class_number: "1865",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Gunn A C",
    class_name: "ECE 9",
    class_title: "Introduction to School-Age Child Care 3 units"
  },
  {
    class_number: "1866",
    class_time: "11:30 a.m.  -  2:35 p.m. T",
    class_location: "BUNDY 440",
    class_instructor: "Mosley K R",
    class_name: "ECE 11",
    class_title: "Child, Family and Community 3 units"
  },
  {
    class_number: "1870",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Backlar N P",
    class_name: "ECE 17",
    class_title: "Introduction to Curriculum 3 units"
  },
  {
    class_number: "1872",
    class_time: "11:30 a.m.  -  2:35 p.m. W",
    class_location: "BUNDY 416",
    class_instructor: "Miller Ca L",
    class_name: "ECE 19",
    class_title: "Teaching in a Diverse Society 3 units"
  },
  {
    class_number: "1874",
    class_time: "11:30 a.m.  -  2:35 p.m. M",
    class_location: "BUNDY 328",
    class_instructor: "Miller Ca L",
    class_name: "ECE 21",
    class_title: "Observation and Assessment 4 units"
  },
  {
    class_number: "1875",
    class_time: "Arrange  -  9 Hours ",
    class_location: " ONLINE",
    class_instructor: "Miller Ca L",
    class_name: "ECE 22",
    class_title: "Practicum in Early Childhood Education 5 units"
  },
  {
    class_number: "4122",
    class_time: "6:30 p.m.  -  9:35 p.m. T",
    class_location: "BUNDY 329",
    class_instructor: "Joachim S L",
    class_name: "ECE 23",
    class_title: "Practicum in Early Intervention 5 units"
  },
  {
    class_number: "1876",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Mosley K R",
    class_name: "ECE 27",
    class_title: "CA Preschool Foundations and Frameworks 2 3 units"
  },
  {
    class_number: "1877",
    class_time: "Arrange  -  9 Hours ",
    class_location: " ONLINE",
    class_instructor: "Maldonado S M",
    class_name: "ECE 28",
    class_title: "Practicum in Transitional Kindergarten Teaching 3 units"
  },
  {
    class_number: "1878",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Grace Y H",
    class_name: "ECE 29",
    class_title: "Reflective Practice Seminar 3 units"
  },
  {
    class_number: "1879",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Joachim S L",
    class_name: "ECE 30",
    class_title: "Strategies for Working with Challenging Behaviors 3 units"
  },
  {
    class_number: "1881",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Parise W A",
    class_name: "ECE 32",
    class_title: "Communicating with Families 3 units"
  },
  {
    class_number: "4123",
    class_time: "6:30 p.m.  -  9:35 p.m. Th",
    class_location: "BUNDY 239",
    class_instructor: "Andrews T D",
    class_name: "ECE 41",
    class_title:
      "Administration 1: Programs in Early Childhood Education 3 units"
  },
  {
    class_number: "4124",
    class_time: "6:30 p.m.  -  9:35 p.m. Th",
    class_location: "BUNDY 239",
    class_instructor: "Andrews T D",
    class_name: "ECE 43",
    class_title:
      "Administration 2: Personnel and Leadership in Early Childhood Education 3 units"
  },
  {
    class_number: "4125",
    class_time: "6:30 p.m.  -  9:35 p.m. M",
    class_location: "BUNDY 328",
    class_instructor: "Elam E J",
    class_name: "ECE 45",
    class_title: "Introduction to Children with Special Needs 3 units"
  },
  {
    class_number: "1883",
    class_time: "11:30 a.m.  -  2:35 p.m. T",
    class_location: "BUNDY 328",
    class_instructor: "Lopez Je",
    class_name: "ECE 46",
    class_title: "Infant and Toddler Development 3 units"
  },
  {
    class_number: "1886",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Manson L J",
    class_name: "ECE 47",
    class_title: "Developing Family Childcare 3 units"
  },
  {
    class_number: "1887",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Khokha E W",
    class_name: "ECE 48",
    class_title: "Adult Supervision and Mentoring in Early Education 3 units"
  },
  {
    class_number: "4126",
    class_time: "6:30 p.m.  -  9:35 p.m. M",
    class_location: "BUNDY 321",
    class_instructor: "Elam E J",
    class_name: "ECE 49",
    class_title:
      "Curriculum and Strategies for Children with Special Needs 3 units"
  },
  {
    class_number: "1888",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Khokha E W",
    class_name: "ECE 55",
    class_title: "Environment as the Third Teacher 3 units"
  },
  {
    class_number: "1889",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Gunn A C",
    class_name: "ECE 64",
    class_title: "Health, Safety, and Nutrition for Young Children 3 units"
  },
  {
    class_number: "1891",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Huff G F",
    class_name: "ECE 71",
    class_title: "Infants and Toddler Education and Care 3 units"
  },
  {
    class_number: "4127",
    class_time: "5 p.m.  -  9:30 p.m. W",
    class_location: "BUNDY 415",
    class_instructor: "Huff G F",
    class_name: "ECE 88A",
    class_title: "Independent Studies in Early Childhood Education 1 unit"
  },
  {
    class_number: "1892",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUNDY 317A",
    class_instructor: "Huff G F",
    class_name: "ECE 88B",
    class_title: "Independent Studies in Early Childhood Education 2 units"
  },
  {
    class_number: "7017",
    class_time: "Arrange  -  2 Hours ",
    class_location: "BUNDY 429",
    class_instructor: "Roddy L L",
    class_name: "ECE 900",
    class_title: "Early Childhood Education Communication Skills 0 units"
  },
  {
    class_number: "7018",
    class_time: "9:30 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 339",
    class_instructor: "Alvarez Hernand L",
    class_name: "ECE 901",
    class_title: "Introduction to Early Care and Education 0 units"
  },
  {
    class_number: "7019",
    class_time: "9:30 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 339",
    class_instructor: "Alvarez Hernand L",
    class_name: "ECE 902",
    class_title: "Culturally Relevant Curriculum 0 units"
  },
  {
    class_number: "7020",
    class_time: "9:30 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 339",
    class_instructor: "Alvarez Hernand L",
    class_name: "ECE 903",
    class_title: "Early Care Licensing and Workforce Readiness 0 units"
  },
  {
    class_number: "1894",
    class_time: "8 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 153",
    class_instructor: "Urrutia A Q",
    class_name: "ECON 1",
    class_title: "Principles of Microeconomics 3 units"
  },
  {
    class_number: "1909",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 153",
    class_instructor: "Garcia C P",
    class_name: "ECON 2",
    class_title: "Principles of Macroeconomics 3 units"
  },
  {
    class_number: "1923",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 263",
    class_instructor: "Rabach E R",
    class_name: "ECON 5",
    class_title:
      "International Political Economy: Introduction to Global Studies 3 units"
  },
  {
    class_number: "1925",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 263",
    class_instructor: "Rabach E R",
    class_name: "ECON 15",
    class_title: "Economic History of the U.S. 3 units"
  },
  {
    class_number: "1927",
    class_time: "Arrange  -  1 Hour ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "ECON 88A",
    class_title: "Independent Studies in Economics 1 unit"
  },
  {
    class_number: "1928",
    class_time: "Arrange  -  2 Hours ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "ECON 88B",
    class_title: "Independent Studies in Economics 2 units"
  },
  {
    class_number: "1929",
    class_time: "Arrange - 7.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Perez-Fernandez L",
    class_name: "EDUC 12",
    class_title:
      "Introduction to Elementary Classroom Teaching & Field Experiences 3 units"
  },
  {
    class_number: "1930",
    class_time: "3 p.m.  -  6:15 p.m. MW",
    class_location: "AIR 101",
    class_instructor: "Cooley S",
    class_name: "ENERGY 1",
    class_title: "Introduction to Energy Efficiency 3 units"
  },
  {
    class_number: "1931",
    class_time: "3 p.m.  -  6:05 p.m. MW",
    class_location: "AIR 101",
    class_instructor: "Cooley S",
    class_name: "ENERGY 2",
    class_title: "Residential Building Science 3 units"
  },
  {
    class_number: "1932",
    class_time: "6:30 p.m.  -  9:35 p.m. TTh",
    class_location: "AIR 101",
    class_instructor: "Cooley S",
    class_name: "ENERGY 3",
    class_title: "Commercial Building Science 4 units"
  },
  {
    class_number: "2214",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "SCI 153",
    class_instructor: "Santos J",
    class_name: "ENGR 1",
    class_title: "Introduction to Engineering 2 units"
  },
  {
    class_number: "4164",
    class_time: "7 p.m.  -  9:30 p.m. MW",
    class_location: "DRSCHR 305",
    class_instructor: "Inamdar N K",
    class_name: "ENGR 11",
    class_title: "Engineering Graphics and Design 3 units"
  },
  {
    class_number: "2215",
    class_time: "7:15 a.m.  -  8:35 a.m. TTh",
    class_location: "SCI 122",
    class_instructor: "Manookian N",
    class_name: "ENGR 12",
    class_title: "Statics 3 units"
  },
  {
    class_number: "2216",
    class_time: "1 p.m.  -  2:20 p.m. MW",
    class_location: "SCI 101",
    class_instructor: "Dang T T",
    class_name: "ENGR 16",
    class_title: "Dynamics 3 units"
  },
  {
    class_number: "2217",
    class_time: "10:30 a.m. - 11:50 a.m. MW",
    class_location: "SCI 122",
    class_instructor: "Dang T T",
    class_name: "ENGR 21",
    class_title: "Circuit Analysis 3 units"
  },
  {
    class_number: "2218",
    class_time: "12 p.m.  -  3:05 p.m. F",
    class_location: "DRSCHR 305",
    class_instructor: "Dang T T",
    class_name: "ENGR 22",
    class_title: "Circuit Analysis Lab 1 unit"
  },
  {
    class_number: "2219",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Dang T T",
    class_name: "ENGR 88A",
    class_title: "Independent Studies in Engineering 1 unit"
  },
  {
    class_number: "2220",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Dang T T",
    class_name: "ENGR 88B",
    class_title: "Independent Studies in Engineering 2 units"
  },
  {
    class_number: "1933",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 206",
    class_instructor: "Winkler K D",
    class_name: "ENGL 1",
    class_title: "Reading and Composition 1 3 units"
  },
  {
    class_number: "1939",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "LA 136",
    class_instructor: "Wright N E",
    class_name: "ENGL    1",
    class_title:
      "Reading and Composition 1 with ENGL   28: Intensive College Writing Skills5 units "
  },
  {
    class_number: "2207",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "DRSCHR 212",
    class_instructor: "Caggiano S E",
    class_name: "ENGL 31",
    class_title: "Advanced Composition 3 units"
  },
  {
    class_number: "5002",
    class_time: "3:45 p.m.  -  5:05 p.m. MW",
    class_location: "CMD 102",
    class_instructor: "Herbert S",
    class_name: "ENGL 300",
    class_title:
      "Advanced Writing and Critical Thinking in the Disciplines 3 units"
  },
  {
    class_number: "2205",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 211",
    class_instructor: "Padilla M R",
    class_name: "ENGL 30A",
    class_title: "Beginning Creative Writing 3 units"
  },
  {
    class_number: "2206",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 211",
    class_instructor: "Padilla M R",
    class_name: "ENGL 30B",
    class_title: "Advanced Creative Writing 3 units"
  },
  {
    class_number: "2158",
    class_time: "8 a.m. - 10:25 a.m. TTh",
    class_location: "LA 115",
    class_instructor: "Orr P L",
    class_name: "ENGL 20",
    class_title: "Reading and Writing 2 5 units"
  },
  {
    class_number: "3589",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "James K R",
    class_name: "ENGL 23",
    class_title: "Intermediate Reading and Vocabulary 3 units"
  },
  {
    class_number: "2164",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 203",
    class_instructor: "Hioureas E C",
    class_name: "ENGL 24",
    class_title: "Grammar Review 3 units"
  },
  {
    class_number: "2034",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CMD 103",
    class_instructor: "Fuchs C A",
    class_name: "ENGL 2",
    class_title: "Critical Analysis and Intermediate Composition 3 units"
  },
  {
    class_number: "4152",
    class_time: "6:45 p.m.  -  9:50 p.m. Th",
    class_location: "HSS 206",
    class_instructor: "Humphrey T F",
    class_name: "ENGL 3",
    class_title: "World Literature 1 3 units"
  },
  {
    class_number: "2151",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "LA 121",
    class_instructor: "Mattessich S N",
    class_name: "ENGL 4",
    class_title: "World Literature 2 3 units"
  },
  {
    class_number: "2152",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 214",
    class_instructor: "Dossett G H",
    class_name: "ENGL 5",
    class_title: "English Literature 1 3 units"
  },
  {
    class_number: "2154",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "DRSCHR 222",
    class_instructor: "Driscoll L V",
    class_name: "ENGL 6",
    class_title: "English Literature 2 3 units"
  },
  {
    class_number: "2155",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 222",
    class_instructor: "Pacchioli J J",
    class_name: "ENGL 7",
    class_title: "American Literature 1 3 units"
  },
  {
    class_number: "2156",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "DRSCHR 210",
    class_instructor: "Arms E D",
    class_name: "ENGL 8",
    class_title: "American Literature 2 3 units"
  },
  {
    class_number: "2157",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Griffy W J",
    class_name: "ENGL 9",
    class_title: "Literature of California 3 units"
  },
  {
    class_number: "3561",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Remmes J",
    class_name: "ENGL 15",
    class_title: "Shakespeare 3 units"
  },
  {
    class_number: "2208",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "DRSCHR 221",
    class_instructor: "Robinson B",
    class_name: "ENGL 34",
    class_title: "Afro-American Literature 3 units"
  },
  {
    class_number: "2209",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Boretz M S",
    class_name: "ENGL 39",
    class_title: "Images of Women in Literature 3 units"
  },
  {
    class_number: "2210",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "DRSCHR 210",
    class_instructor: "Hioureas E C",
    class_name: "ENGL 50",
    class_title: "Mythology 3 units"
  },
  {
    class_number: "4162",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "DRSCHR 212",
    class_instructor: "Remmes J",
    class_name: "ENGL 51",
    class_title: "Literature of the Bible: Old Testament 3 units"
  },
  {
    class_number: "2211",
    class_time: "3:45 p.m.  -  5:05 p.m. T",
    class_location: "DRSCHR 212",
    class_instructor: "Del George D K",
    class_name: "ENGL 52",
    class_title: "Literature of the Bible: New Testament 3 units"
  },
  {
    class_number: "4163",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "DRSCHR 215",
    class_instructor: "Martinez-Gil C",
    class_name: "ENGL 57",
    class_title: "Latin-American Literature 3 units"
  },
  {
    class_number: "2212",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "DRSCHR 308",
    class_instructor: "Herbert S",
    class_name: "ENGL 59",
    class_title: "Lesbian and Gay Literature 3 units"
  },
  {
    class_number: "2213",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "HSS 150",
    class_instructor: "Menton K T",
    class_name: "ENGL 60",
    class_title: "English Seminar (Science/Speculative Fiction) 3 units"
  },
  {
    class_number: "9741",
    class_time: "10 a.m. - 11:50 a.m. W",
    class_location: " MALIBU",
    class_instructor: "Davis C V",
    class_name: "ENGL E27",
    class_title: "Poetry and Fiction"
  },
  {
    class_number: "9743",
    class_time: "9 a.m. - 11:15 a.m. M",
    class_location: "EC 1227 409",
    class_instructor: "Kronsberg G J",
    class_name: "ENGL E30",
    class_title: "Creative Writing"
  },
  {
    class_number: "9745",
    class_time: "9 a.m. - 11:15 a.m. Th",
    class_location: "EC 1227 408",
    class_instructor: "Wali M",
    class_name: "ENGL E33",
    class_title: "Autobiography"
  },
  {
    class_number: "9749",
    class_time: "1 p.m.  -  3:50 p.m. M",
    class_location: "EC 1227 408",
    class_instructor: "Wali M",
    class_name: "ENGL E34",
    class_title: "Writing for Publication"
  },
  {
    class_number: "9750",
    class_time: "11:30 a.m.  -  1:20 p.m. M",
    class_location: "EC 1227 407",
    class_instructor: "Kronsberg G J",
    class_name: "ENGL E37",
    class_title: "Writing Seminar"
  },
  {
    class_number: "2290",
    class_time: "9:30 a.m. - 12:35 p.m. T",
    class_location: "CMD 207",
    class_instructor: "Javelosa D A",
    class_name: "ET 13",
    class_title: "2D Game Prototyping 3 units"
  },
  {
    class_number: "2291",
    class_time: "9:30 a.m. - 12:35 p.m. Th",
    class_location: "CMD 122",
    class_instructor: "Javelosa D A",
    class_name: "ET 42",
    class_title: "Principles of Game Development 3 units"
  },
  {
    class_number: "2293",
    class_time: "2 p.m.  -  5:05 p.m. M",
    class_location: "CMD 271",
    class_instructor: "Javelosa D A",
    class_name: "ET 44",
    class_title: "Game Design/Play Mechanics  3 units"
  },
  {
    class_number: "2295",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Fria C T",
    class_name: "ET 88A",
    class_title: "Independent Studies in Entertainment Technology 1 unit"
  },
  {
    class_number: "4171",
    class_time: "4:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 286",
    class_instructor: "Karol-Crowther C I",
    class_name: "ET 92",
    class_title: "Figure in Motion 3 units"
  },
  {
    class_number: "4165",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "HSS 252",
    class_instructor: "Leddy G",
    class_name: "ENVRN 7",
    class_title: "Introduction to Environmental Studies3 units"
  },
  {
    class_number: "2221",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 106",
    class_instructor: "Kawaguchi L A",
    class_name: "ENVRN 14",
    class_title: "U.S. Environmental History 3 units"
  },
  {
    class_number: "2223",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 104",
    class_instructor: "Huffaker P",
    class_name: "ENVRN 20",
    class_title: "Environmental Ethics 3 units"
  },
  {
    class_number: "2224",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 204",
    class_instructor: "Fouser D C",
    class_name: "ENVRN 32",
    class_title: "Global Environmental History 3 units"
  },
  {
    class_number: "2225",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 253",
    class_instructor: "Schwartz A F",
    class_name: "ENVRN 40",
    class_title: "Environmental Psychology 3 units"
  },
  {
    class_number: "2233",
    class_time: "8 a.m. - 11:05 a.m. TTh",
    class_location: "ESL 123",
    class_instructor: "Koenig Golombek L K",
    class_name: "ESL 10G",
    class_title:
      "Multiple Skills Preparation: Listening, Speaking, and Grammar 6 units"
  },
  {
    class_number: "2237",
    class_time: "7:45 a.m. - 10:50 a.m. T",
    class_location: "LA 243",
    class_instructor: "Kunimoto T A",
    class_name: "ESL 10W",
    class_title: "Multiple Skills Preparation: Reading and Writing 6 units"
  },
  {
    class_number: "2240",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "ESL 104",
    class_instructor: "Jaffe S R",
    class_name: "ESL 11A",
    class_title: "Basic English 1 6 units"
  },
  {
    class_number: "2246",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "ESL 125",
    class_instructor: "Ibaraki A T",
    class_name: "ESL 11B",
    class_title: "Basic English 2 3 units"
  },
  {
    class_number: "2250",
    class_time: "11:15 a.m.  -  1:20 p.m. MW",
    class_location: "ESL 103",
    class_instructor: "Ashleigh S B",
    class_name: "ESL 14A",
    class_title:
      "Pronunciation and Spelling: Vowel and Consonant Sounds 2 units"
  },
  {
    class_number: "2251",
    class_time: "12:45 p.m.  -  2:50 p.m. TTh",
    class_location: "ESL 104",
    class_instructor: "Marasco J A",
    class_name: "ESL 14B",
    class_title: "Pronunciation: Rhythm and Intonation 3 units"
  },
  {
    class_number: "2253",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "ESL 123",
    class_instructor: "Bostwick L H",
    class_name: "ESL 15",
    class_title: "Conversation and Culture in the U.S. 3 units"
  },
  {
    class_number: "2254",
    class_time: "11:15 a.m.  -  1:35 p.m. F",
    class_location: "ESL 104",
    class_instructor: "Staff",
    class_name: "ESL 16A",
    class_title: "The Noun System and Articles 1 unit"
  },
  {
    class_number: "2256",
    class_time: "8:30 a.m. - 10:50 a.m. F",
    class_location: "ESL 104",
    class_instructor: "Staff",
    class_name: "ESL 16B",
    class_title: "Using Verb Tenses 1 unit"
  },
  {
    class_number: "2258",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Douglass J T",
    class_name: "ESL 16C",
    class_title: "Sentence Structure and Punctuation 1 unit"
  },
  {
    class_number: "2260",
    class_time: "11:30 a.m.  -  2:35 p.m. F",
    class_location: "ESL 123",
    class_instructor: "Stivener M",
    class_name: "ESL 17",
    class_title: "Intermediate Reading Skills 3 units"
  },
  {
    class_number: "2261",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Ibaraki A T",
    class_name: "ESL 20A",
    class_title: "Advanced Grammar Workshop 3 units"
  },
  {
    class_number: "2263",
    class_time: "12 p.m.  -  2:05 p.m. MW",
    class_location: "ESL 104",
    class_instructor: "Marasco J A",
    class_name: "ESL 20B",
    class_title: "Advanced Grammar and Editing 3 units"
  },
  {
    class_number: "2265",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "ESL 103",
    class_instructor: "Ashleigh S B",
    class_name: "ESL 21A",
    class_title: "English Fundamentals 1 3 units"
  },
  {
    class_number: "2278",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "ESL 123",
    class_instructor: "Hardacredecerqu B L",
    class_name: "ESL 21B",
    class_title: "English Fundamentals 2 3 units"
  },
  {
    class_number: "2287",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Graziadei K N",
    class_name: "ESL 23",
    class_title: "Academic Reading and Study Skills 3 units"
  },
  {
    class_number: "2288",
    class_time: "2:15 p.m.  -  4:20 p.m. MW",
    class_location: "ESL 125",
    class_instructor: "Torrez P J",
    class_name: "ESL 28",
    class_title: "Academic Vocabulary Skills 3 units"
  },
  {
    class_number: "7021",
    class_time: "9:30 a.m. - 12:30 p.m. TTh",
    class_location: "BUNDY 236",
    class_instructor: "Mumba A I",
    class_name: "ESL 902",
    class_title: "English as a Second Language Level 2 0 units"
  },
  {
    class_number: "7022",
    class_time: "9:30 a.m. - 12:30 p.m. TTh",
    class_location: "BUNDY 435",
    class_instructor: "Morgan J S",
    class_name: "ESL 903",
    class_title: "English as a Second Language Level 3 0 units"
  },
  {
    class_number: "7023",
    class_time: "9:30 a.m. - 12:30 p.m. MW",
    class_location: "BUNDY 435",
    class_instructor: "Harvey L",
    class_name: "ESL 904",
    class_title: "English as a Second Language Level 4 0 units"
  },
  {
    class_number: "7024",
    class_time: "9:30 a.m. - 12:30 p.m. MW",
    class_location: "BUNDY 428",
    class_instructor: "Borgardt M L",
    class_name: "ESL 905",
    class_title: "English as a Second Language Level 5 0 units"
  },
  {
    class_number: "7025",
    class_time: "9 a.m.  -  3 p.m. S",
    class_location: "BUNDY 428",
    class_instructor: "Joshi K",
    class_name: "ESL 906",
    class_title: "English as a Second Language Level 6 0 units"
  },
  {
    class_number: "7027",
    class_time: "9:30 a.m. - 12:30 p.m. M",
    class_location: "BUNDY 236",
    class_instructor: "Mcgee N",
    class_name: "ESL 911",
    class_title: "Beginning Listening, Speaking and Pronunciation 0 units"
  },
  {
    class_number: "7028",
    class_time: "1:30 p.m.  -  4:30 p.m. T",
    class_location: "BUNDY 435",
    class_instructor: "Bronstein M G",
    class_name: "ESL 913",
    class_title: "Intermediate Listening, Speaking and Pronunciation 0 units"
  },
  {
    class_number: "7030",
    class_time: "9:30 a.m. - 12:30 p.m. W",
    class_location: "BUNDY 415",
    class_instructor: "Mcgee N",
    class_name: "ESL 915",
    class_title: "Advanced Listening, Speaking and Pronunciation 0 units"
  },
  {
    class_number: "7032",
    class_time: "9:30 a.m. - 12:30 p.m. W",
    class_location: "BUNDY 236",
    class_instructor: "Koenig Golombek L K",
    class_name: "ESL 961",
    class_title: "Beginning Reading and Writing 0 units"
  },
  {
    class_number: "7033",
    class_time: "1:30 p.m.  -  4:30 p.m. M",
    class_location: "BUNDY 435",
    class_instructor: "Holmes W J",
    class_name: "ESL 963",
    class_title: "Intermediate Reading and Writing 0 units"
  },
  {
    class_number: "7034",
    class_time: "9:30 a.m. - 12:30 p.m. F",
    class_location: "BUNDY 428",
    class_instructor: "Poreba J S",
    class_name: "ESL 965",
    class_title: "Advanced Reading and Writing 0 units"
  },
  {
    class_number: "7036",
    class_time: "9:30 a.m. - 12:30 p.m. F",
    class_location: "BUNDY 435",
    class_instructor: "Staff",
    class_name: "ESL 973",
    class_title: "Intermediate Idioms, Prepositions, and Vocabulary 0 units"
  },
  {
    class_number: "7037",
    class_time: "9:30 a.m. - 12:30 p.m. T",
    class_location: "BUNDY 428",
    class_instructor: "Easton J A",
    class_name: "ESL 975",
    class_title: "Advanced Idioms, Prepositions, and Vocabulary 0 units"
  },
  {
    class_number: "7038",
    class_time: "6 p.m.  -  8 p.m. MW",
    class_location: "BUNDY 435",
    class_instructor: "Mumba A I",
    class_name: "ESL 980",
    class_title: "ESL US Citizenship Test Preparation 0 units"
  },
  {
    class_number: "2301",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "BUS 105",
    class_instructor: "Ivas L",
    class_name: "FASHN 1",
    class_title: "Introduction to the Fashion Industry 3 units"
  },
  {
    class_number: "2303",
    class_time: "12:45 p.m.  -  4:50 p.m. Th",
    class_location: "BUS 105",
    class_instructor: "Lake R G",
    class_name: "FASHN 2",
    class_title: "Color Analysis 3 units"
  },
  {
    class_number: "2305",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "BUS 107",
    class_instructor: "Allen A",
    class_name: "FASHN 3",
    class_title: "Apparel Construction 3 units"
  },
  {
    class_number: "2308",
    class_time: "9 a.m. - 12:05 p.m. F",
    class_location: "BUS 119",
    class_instructor: "Louis L N",
    class_name: "FASHN 5",
    class_title: "Fashion Buying 3 units"
  },
  {
    class_number: "2310",
    class_time: "8 a.m. - 10:05 a.m. TTh",
    class_location: "BUS 107",
    class_instructor: "Ardell J B",
    class_name: "FASHN 6A",
    class_title: "Pattern Analysis and Design 2 units"
  },
  {
    class_number: "4176",
    class_time: "6:45 p.m.  -  9:50 p.m. MW",
    class_location: "BUS 105",
    class_instructor: "Lake R G",
    class_name: "FASHN 7",
    class_title: "Fabrics for Fashion Design and Merchandising 3 units"
  },
  {
    class_number: "4177",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "BUS 106",
    class_instructor: "Reiner H G",
    class_name: "FASHN 8",
    class_title: "History of Fashion Design 3 units"
  },
  {
    class_number: "2312",
    class_time: "12:45 p.m.  -  4:50 p.m. T",
    class_location: "BUS 105",
    class_instructor: "Armstrong J I",
    class_name: "FASHN 9A",
    class_title: "Fashion Illustration 3 units"
  },
  {
    class_number: "4179",
    class_time: "5:45 p.m.  -  9:50 p.m. Th",
    class_location: "BUS 105",
    class_instructor: "Armstrong J I",
    class_name: "FASHN 9B",
    class_title: "Advanced Fashion Illustration and Advertising 2 units"
  },
  {
    class_number: "2313",
    class_time: "11:15 a.m.  -  2:20 p.m. MW",
    class_location: "BUS 107",
    class_instructor: "Allen A",
    class_name: "FASHN 10",
    class_title: "Advanced Design and Construction 3 units"
  },
  {
    class_number: "2314",
    class_time: "11:15 a.m.  -  1:40 p.m. T",
    class_location: "LIB 192",
    class_instructor: "Louis L N",
    class_name: "FASHN 12",
    class_title: "Fashion Show Production 3 units"
  },
  {
    class_number: "2315",
    class_time: "3:30 p.m.  -  6:35 p.m. TTh",
    class_location: "BUS 107",
    class_instructor: "Cooper S A",
    class_name: "FASHN 13",
    class_title: "Draping I 3 units"
  },
  {
    class_number: "2316",
    class_time: "11:15 a.m.  -  1:40 p.m. TTh",
    class_location: "BUS 107",
    class_instructor: "Ardell J B",
    class_name: "FASHN 17",
    class_title: "Apparel Production Manufacturing Techniques 3 units"
  },
  {
    class_number: "2318",
    class_time: "2:15 p.m.  -  6:20 p.m. Th",
    class_location: "BUS 255",
    class_instructor: "Armstrong R W",
    class_name: "FASHN 18",
    class_title: "Computer Aided Fashion Design and Merchandising 2 units"
  },
  {
    class_number: "4180",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "BUS 119",
    class_instructor: "Kolko S R",
    class_name: "FASHN 19",
    class_title: "Fashion Marketing 3 units"
  },
  {
    class_number: "2319",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 105",
    class_instructor: "Ivas L",
    class_name: "FASHN 20",
    class_title: "Window Display for Fashion 3 units"
  },
  {
    class_number: "4181",
    class_time: "5:15 p.m.  -  9:25 p.m. F",
    class_location: "BUS 255",
    class_instructor: "Armstrong R W",
    class_name: "FASHN 21",
    class_title: "Digital Fashion Portfolio 2 units"
  },
  {
    class_number: "2321",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Armstrong R W",
    class_name: "FASHN 88A",
    class_title: "Independent Studies in Fashion 1 unit"
  },
  {
    class_number: "2322",
    class_time: "Arrange - TIME ",
    class_location: " ",
    class_instructor: "Armstrong R W",
    class_name: "FASHN 88B",
    class_title: "Independent Studies in Fashion 2 units"
  },
  {
    class_number: "2324",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Ivas L",
    class_name: "FASHN 90A",
    class_title: "Internship 1 unit"
  },
  {
    class_number: "2325",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Ivas L",
    class_name: "FASHN 90B",
    class_title: "Internship 2 units"
  },
  {
    class_number: "2326",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ",
    class_instructor: "Ivas L",
    class_name: "FASHN 90C",
    class_title: "Internship 3 units"
  },
  {
    class_number: "2327",
    class_time: "9 a.m.  -  1:05 p.m. F",
    class_location: "CMD 180",
    class_instructor: "Leech M R",
    class_name: "FILM 1",
    class_title: "Film Appreciation: Introduction to Cinema 3 units"
  },
  {
    class_number: "2335",
    class_time: "2:15 p.m.  -  6:20 p.m. M",
    class_location: "CMD 203",
    class_instructor: "Flood S W",
    class_name: "FILM 2",
    class_title: "History of Motion Pictures 3 units"
  },
  {
    class_number: "2338",
    class_time: "2:15 p.m.  -  6:20 p.m. M",
    class_location: "CMD 180",
    class_instructor: "Laffey S A",
    class_name: "FILM 5",
    class_title: "Film and Society 3 units"
  },
  {
    class_number: "4185",
    class_time: "6:30 p.m. - 10:35 p.m. T",
    class_location: "CMD 180",
    class_instructor: "Shaw R D",
    class_name: "FILM 6",
    class_title: "Women in Film 3 units"
  },
  {
    class_number: "2341",
    class_time: "1:45 p.m.  -  5:50 p.m. W",
    class_location: "CMD 180",
    class_instructor: "Carrasco S",
    class_name: "FILM 7",
    class_title: "American Cinema: Crossing Cultures 3 units"
  },
  {
    class_number: "2342",
    class_time: "12:45 p.m.  -  4:50 p.m. W",
    class_location: "CMD 131",
    class_instructor: "Birnbaum M J",
    class_name: "FILM 8",
    class_title: "The Popular Film Genres 3 units"
  },
  {
    class_number: "4186",
    class_time: "6 p.m. - 10:05 p.m. W",
    class_location: "CMD 180",
    class_instructor: "Kanin J D",
    class_name: "FILM 9",
    class_title: "The Great Film Makers 3 units"
  },
  {
    class_number: "4187",
    class_time: "6:30 p.m.  -  9:35 p.m. Th",
    class_location: "CMD 202",
    class_instructor: "Manojlovic M",
    class_name: "FILM 10",
    class_title: "Film Criticism and Interpretation 3 units"
  },
  {
    class_number: "2344",
    class_time: "2:15 p.m.  -  6:20 p.m. T",
    class_location: "BUNDY 119",
    class_instructor: "Poirier N P",
    class_name: "FILM 11",
    class_title: "Literature into Film 3 units"
  },
  {
    class_number: "2345",
    class_time: "2:15 p.m.  -  5:20 p.m. T",
    class_location: "CMD 128",
    class_instructor: "Lemond J W",
    class_name: "FILM 20",
    class_title: "Beginning Scriptwriting 3 units"
  },
  {
    class_number: "2347",
    class_time: "2:15 p.m.  -  5:20 p.m. W",
    class_location: "LS 152",
    class_instructor: "Lemond J W",
    class_name: "FILM 21",
    class_title: "Advanced Scriptwriting 3 units"
  },
  {
    class_number: "2348",
    class_time: "12:45 p.m.  -  4:50 p.m. T",
    class_location: "CMD 209",
    class_instructor: "Daniels R",
    class_name: "FILM 30",
    class_title: "Production Planning for Film and Video 3 units"
  },
  {
    class_number: "4193",
    class_time: "5 p.m.  -  9:05 p.m. W",
    class_location: "CMD 182",
    class_instructor: "Bartesaghi S",
    class_name: "FILM 31",
    class_title: "Introduction to Digital Filmmaking 3 units"
  },
  {
    class_number: "2350",
    class_time: "8 a.m. - 11:05 a.m. W",
    class_location: "CMD 182",
    class_instructor: "Bartesaghi S",
    class_name: "FILM 32",
    class_title: "Intermediate Digital Filmmaking 3 units"
  },
  {
    class_number: "2352",
    class_time: "11:15 a.m.  -  3:20 p.m. W",
    class_location: "CMD 182",
    class_instructor: "Bartesaghi S",
    class_name: "FILM 32L",
    class_title: "Intermediate Digital Filmmaking Lab 1 unit"
  },
  {
    class_number: "2354",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "CMD 182",
    class_instructor: "Carrasco S",
    class_name: "FILM 33",
    class_title: "Making the Short Film 3 units"
  },
  {
    class_number: "2356",
    class_time: "Arrange  -  6 Hours ",
    class_location: "CMD 182",
    class_instructor: "Carrasco S",
    class_name: "FILM 33L",
    class_title: "Making the Short Film Lab 2 units"
  },
  {
    class_number: "2357",
    class_time: "8 a.m. - 11:05 a.m. S",
    class_location: "CMD 182",
    class_instructor: "Bartesaghi S",
    class_name: "FILM 34",
    class_title: "Advanced Digital Filmmaking 3 units"
  },
  {
    class_number: "2358",
    class_time: "Arrange  -  4 Hours ",
    class_location: "CMD 182",
    class_instructor: "Bartesaghi S",
    class_name: "FILM 34L",
    class_title: "Advanced Digital Filmmaking Lab 1 unit"
  },
  {
    class_number: "2359",
    class_time: "8 a.m. - 12:05 p.m. S",
    class_location: "CMD 180",
    class_instructor: "Solanki V M",
    class_name: "FILM 40",
    class_title: "Cinematography 3 units"
  },
  {
    class_number: "2361",
    class_time: "12:30 p.m.  -  4:35 p.m. S",
    class_location: "CMD 280",
    class_instructor: "Platt H H",
    class_name: "FILM 50",
    class_title: "Production Sound 3 units"
  },
  {
    class_number: "2362",
    class_time: "Arrange - 1.2 Hours ",
    class_location: "LS 131",
    class_instructor: "Munoz M E",
    class_name: "FILM 88A",
    class_title: "Independent Studies in Film Studies, 1 unit"
  },
  {
    class_number: "2363",
    class_time: "Arrange  -  1 Hour ",
    class_location: "NONE 68",
    class_instructor: "Munoz M E",
    class_name: "FILM 90A",
    class_title: "Internship in Film Studies 1 unit"
  },
  {
    class_number: "2364",
    class_time: "9:30 a.m. - 11 a.m. TThF",
    class_location: "MC 12",
    class_instructor: "Isner-Ball D R",
    class_name: "FRENCH 1",
    class_title: "Elementary French I 5 units"
  },
  {
    class_number: "2367",
    class_time: "2:30 p.m.  -  4:55 p.m. TTh",
    class_location: "DRSCHR 217",
    class_instructor: "Aparicio M A",
    class_name: "FRENCH 2",
    class_title: "Elementary French II 5 units"
  },
  {
    class_number: "4196",
    class_time: "5 p.m.  -  7:25 p.m. TTh",
    class_location: "DRSCHR 222",
    class_instructor: "Chevant-Aksoy A",
    class_name: "FRENCH 4",
    class_title: "Intermediate French II 5 units"
  },
  {
    class_number: "4207",
    class_time: "5:30 p.m.  -  8:35 p.m. TTh",
    class_location: "BUS 250",
    class_instructor: "Liu J",
    class_name: "GIS 20",
    class_title: "Introduction to Geographic Information Systems 3 units"
  },
  {
    class_number: "4208",
    class_time: "5:30 p.m.  -  8:35 p.m. TTh",
    class_location: "BUS 250",
    class_instructor: "Liu J",
    class_name: "GIS 23",
    class_title: "Intermediate Geographic Information Systems 3 units"
  },
  {
    class_number: "2392",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Mason J",
    class_name: "GIS 26",
    class_title: "Introduction to Remote Sensing 3 units"
  },
  {
    class_number: "2369",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "DRSCHR 208",
    class_instructor: "Liu J",
    class_name: "GEOG 1",
    class_title: "Physical Geography 3 units"
  },
  {
    class_number: "2370",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUS 201",
    class_instructor: "Morris P S",
    class_name: "GEOG 2",
    class_title: "Introduction to Human Geography 3 units"
  },
  {
    class_number: "2372",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Kranz J",
    class_name: "GEOG 3",
    class_title: "Weather and Climate 3 units"
  },
  {
    class_number: "2373",
    class_time: "9:30 a.m. - 12:35 p.m. MW",
    class_location: "HSS 251",
    class_instructor: "Hackeling J",
    class_name: "GEOG 5",
    class_title: "Physical Geography with Lab 4 units"
  },
  {
    class_number: "4201",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "HSS 252",
    class_instructor: "Leddy G",
    class_name: "GEOG 7",
    class_title: "Introduction to Environmental Studies 3 units"
  },
  {
    class_number: "2376",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "HSS 253",
    class_instructor: "Morris P S",
    class_name: "GEOG 8",
    class_title: "Introduction to Urban Studies 3 units"
  },
  {
    class_number: "2378",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "DRSCHR 207",
    class_instructor: "Abate A",
    class_name: "GEOG 11",
    class_title: "World Geography: Introduction to Global Studies 3 units"
  },
  {
    class_number: "2379",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 251",
    class_instructor: "Morris P S",
    class_name: "GEOG 14",
    class_title: "Geography of California 3 units"
  },
  {
    class_number: "4202",
    class_time: "5:30 p.m.  -  8:35 p.m. TTh",
    class_location: "BUS 250",
    class_instructor: "Liu J",
    class_name: "GEOG 20",
    class_title: "Introduction to Geographic Information Systems 3 units"
  },
  {
    class_number: "4203",
    class_time: "5:30 p.m.  -  8:35 p.m. TTh",
    class_location: "BUS 250",
    class_instructor: "Liu J",
    class_name: "GEOG 23",
    class_title: "Intermediate Geographic Information Systems 3 units"
  },
  {
    class_number: "2381",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "DRSCHR 205",
    class_instructor: "Hall J M",
    class_name: "GEOL 1",
    class_title: "Physical Geology without Lab 3 units"
  },
  {
    class_number: "2383",
    class_time: "8 a.m. - 11:05 a.m. T",
    class_location: "DRSCHR 136",
    class_instructor: "Melendez C",
    class_name: "GEOL 3",
    class_title: "Introduction to Environmental Geology 3 units"
  },
  {
    class_number: "2384",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "DRSCHR 205",
    class_instructor: "Melendez C",
    class_name: "GEOL 4",
    class_title: "Physical Geology with Lab 4 units"
  },
  {
    class_number: "4205",
    class_time: "5:15 p.m.  -  8:20 p.m. T",
    class_location: "DRSCHR 208",
    class_instructor: "Grippo A",
    class_name: "GEOL 5",
    class_title: "Historical Geology with Lab 4 units"
  },
  {
    class_number: "2388",
    class_time: "11:10 a.m. - 12:40 p.m. MWF",
    class_location: "MC 2",
    class_instructor: "Staff",
    class_name: "GERMAN 1",
    class_title: "Elementary German I 5 units"
  },
  {
    class_number: "2390",
    class_time: "2:30 p.m.  -  4:55 p.m. TTh",
    class_location: "MC 12",
    class_instructor: "Tanaka D J",
    class_name: "GERMAN 2",
    class_title: "Elementary German II 5 units"
  },
  {
    class_number: "4436",
    class_time: "7:30 p.m.  -  9:55 p.m. TTh",
    class_location: "DRSCHR 202",
    class_instructor: "Lashgari Rensel M",
    class_name: "GERMAN 3",
    class_title: "Intermediate German I 5 units"
  },
  {
    class_number: "2393",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "LS 152",
    class_instructor: "Movius L",
    class_name: "GLOBAL STUDIES 3",
    class_title: "Global Media 3 units"
  },
  {
    class_number: "2395",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 263",
    class_instructor: "Rabach E R",
    class_name: "GLOBAL STUDIES 5",
    class_title:
      "International Political Economy: Introduction to Global Studies 3 units"
  },
  {
    class_number: "2397",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "LS 101",
    class_instructor: "Monteiro N",
    class_name: "GLOBAL STU",
    class_title: "DIES 10, Global Issues 3 unit"
  },
  {
    class_number: "2398",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "DRSCHR 207",
    class_instructor: "Abate A",
    class_name: "GLOBAL STUDIES 11, World Geography",
    class_title: "Introduction to Global Studies 3 units"
  },
  {
    class_number: "2401",
    class_time: "9:30 a.m. - 12:35 p.m. F",
    class_location: "CMD 206",
    class_instructor: "Vruwink N R",
    class_name: "GR DES 18",
    class_title: "Introduction to Graphic Design Applications 3 units"
  },
  {
    class_number: "2405",
    class_time: "1 p.m.  -  5:05 p.m. T",
    class_location: "CMD 122",
    class_instructor: "Baduel Z M",
    class_name: "GR DES 31",
    class_title: "Graphic Design Studio 1 2 units"
  },
  {
    class_number: "2407",
    class_time: "8:30 a.m. - 12:35 p.m. W",
    class_location: "CMD 122",
    class_instructor: "Turner L J",
    class_name: "GR DES 33",
    class_title: "Typography Design 1 2 units"
  },
  {
    class_number: "2409",
    class_time: "Arrange  -  5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Mazzara E",
    class_name: "GR DES 34",
    class_title: "Publication and Page Design I 3 units"
  },
  {
    class_number: "2410",
    class_time: "1 p.m.  -  5:05 p.m. Th",
    class_location: "CMD 122",
    class_instructor: "Robinson K C",
    class_name: "GR DES 35",
    class_title: "Sketching For Graphic Design 2 units"
  },
  {
    class_number: "2412",
    class_time: "1 p.m.  -  5:05 p.m. W",
    class_location: "CMD 206",
    class_instructor: "Baduel Z M",
    class_name: "GR DES 38",
    class_title: "Digital Illustration 1 4 units"
  },
  {
    class_number: "2413",
    class_time: "2 p.m.  -  6:05 p.m. F",
    class_location: "CMD 271",
    class_instructor: "Donon S G",
    class_name: "GR DES 41",
    class_title: "Graphic Design Studio 2 2 units"
  },
  {
    class_number: "4212",
    class_time: "5:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 122",
    class_instructor: "Tanaka Bonita R",
    class_name: "GR DES 43",
    class_title: "Typography Design 2 2 units"
  },
  {
    class_number: "2414",
    class_time: "9:30 a.m. - 12:35 p.m. T",
    class_location: "CMD 206",
    class_instructor: "Turner L J",
    class_name: "GR DES 44",
    class_title: "Publication and Page Design 2 3 units"
  },
  {
    class_number: "2415",
    class_time: "1 p.m.  -  5:05 p.m. Th",
    class_location: "CMD 271",
    class_instructor: "Tanaka Bonita R",
    class_name: "GR DES 50",
    class_title: "Graphic Design Portfolio and Professional Practices 2 units"
  },
  {
    class_number: "2416",
    class_time: "1 p.m.  -  5:05 p.m. T",
    class_location: "CMD 271",
    class_instructor: "Hill R L",
    class_name: "GR DES 51",
    class_title: "Graphic Design Studio 3 2 units"
  },
  {
    class_number: "2417",
    class_time: "9:30 a.m. - 12:35 p.m. T",
    class_location: "CMD 271",
    class_instructor: "Johnson L D",
    class_name: "GR DES 60",
    class_title: "Design Research 2 units"
  },
  {
    class_number: "2419",
    class_time: "2 p.m.  -  5:05 p.m. S",
    class_location: "CMD 272",
    class_instructor: "Cabrera S D",
    class_name: "GR DES 61",
    class_title: "User Experience Design 1 3 units"
  },
  {
    class_number: "3464",
    class_time: "2 p.m.  -  5:05 p.m. S",
    class_location: "CMD 124",
    class_instructor: "Patel B",
    class_name: "GR DES 62",
    class_title: "User Experience Design 2 3 units"
  },
  {
    class_number: "2420",
    class_time: "9:30 a.m. - 12:35 p.m. M",
    class_location: "CMD 206",
    class_instructor: "Chan N R",
    class_name: "GR DES 64",
    class_title: "Digital Imaging for Design 3 units"
  },
  {
    class_number: "2423",
    class_time: "9:30 a.m. - 12:35 p.m. W",
    class_location: "CMD 280",
    class_instructor: "Torres H",
    class_name: "GR DES 65",
    class_title: "Web Design 1 2 units"
  },
  {
    class_number: "2425",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Besler I H",
    class_name: "GR DES 66",
    class_title: "Web Design 2 3 units"
  },
  {
    class_number: "2426",
    class_time: "1 p.m.  -  4:05 p.m. T",
    class_location: "CMD 206",
    class_instructor: "Safioulline M",
    class_name: "GR DES 67",
    class_title: "Web Design 3 3 units"
  },
  {
    class_number: "4220",
    class_time: "6:30 p.m.  -  9:35 p.m. MW",
    class_location: "CMD 209",
    class_instructor: "Kelley M",
    class_name: "GR DES 71",
    class_title: "Motion Graphics 1 3 units"
  },
  {
    class_number: "4222",
    class_time: "6:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 208",
    class_instructor: "Heaton W B",
    class_name: "GR DES 71B",
    class_title: "Motion Graphics 2 3 units"
  },
  {
    class_number: "2427",
    class_time: "2 p.m.  -  5:05 p.m. Th",
    class_location: "CMD 206",
    class_instructor: "Safioulline M",
    class_name: "GR DES 75",
    class_title: "Mobile Design 1 3 units"
  },
  {
    class_number: "2429",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Anvari S S",
    class_name: "GR DES 76",
    class_title: "Mobile Design 2 3 units"
  },
  {
    class_number: "9751",
    class_time: "8:30 a.m. - 10:20 a.m. WF",
    class_location: "EC 1227 308",
    class_instructor: "Dee D",
    class_name: "HEALTH E21",
    class_title: "Yoga Health & Safety, Principles & Practices for Older Adults"
  },
  {
    class_number: "9756",
    class_time: "8:30 a.m.  -  9:45 a.m. TTh",
    class_location: "EC 1227 308",
    class_instructor: "Holtzermann C",
    class_name: "HEALTH E22",
    class_title: "Chi Gong Principles & Practices for Older Adults"
  },
  {
    class_number: "9757",
    class_time: "9 a.m. - 10:15 a.m. MF",
    class_location: " VP CTR",
    class_instructor: "Akers P A",
    class_name: "HEALTH E23",
    class_title: "T'ai Chi Principles & Practices for Older Adults"
  },
  {
    class_number: "9762",
    class_time: "8:30 a.m.  -  9:45 a.m. TTh",
    class_location: " VA PK",
    class_instructor: "Moy D N",
    class_name: "HEALTH E24",
    class_title: "Physical Fitness Principles & Practices for Older Adults"
  },
  {
    class_number: "9768",
    class_time: "8 a.m.  -  9:15 a.m. TTh",
    class_location: "EC 1227 304",
    class_instructor: "Regalado O",
    class_name: "HEALTH E25",
    class_title:
      "Strength & Stamina Training Principles & Practices for Older Adults"
  },
  {
    class_number: "9773",
    class_time: "12 p.m.  -  1:50 p.m. W",
    class_location: "EC 1227 307",
    class_instructor: "Evans Jami R",
    class_name: "HEALTH E30",
    class_title: "Personal Safety - Fall Prevention"
  },
  {
    class_number: "9774",
    class_time: "8 a.m.  -  9:50 a.m. S",
    class_location: " VA PK",
    class_instructor: "Holtzermann C",
    class_name: "HEALTH E34",
    class_title: "Stress Reduction through Yoga"
  },
  {
    class_number: "9777",
    class_time: "9 a.m. - 10:15 a.m. MW",
    class_location: " 1450OCEN",
    class_instructor: "Vaillancourt A",
    class_name: "HEALTH E38",
    class_title: "Joint Health & Mobility for Older Adults"
  },
  {
    class_number: "9782",
    class_time: "10:30 a.m. - 11:45 a.m. T",
    class_location: "EC 1227 307",
    class_instructor: "Phillips B S",
    class_name: "HEALTH E63",
    class_title: "Body Conditioning After a Stroke"
  },
  {
    class_number: "9831",
    class_time: "2:45 p.m.  -  4 p.m. F",
    class_location: "CPC 201",
    class_instructor: "Fisher Je",
    class_name: "HEALTH E80",
    class_title: "Introduction to SMC Fitness Center"
  },
  {
    class_number: "7051",
    class_time: "9 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 328",
    class_instructor: "Jabbari-Kohnehs N",
    class_name: "HEALTH 900",
    class_title:
      "Introduction to the Career of a Rehabilitation Therapy Aide 0 units"
  },
  {
    class_number: "7040",
    class_time: "9 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 328",
    class_instructor: "Jabbari-Kohnehs N",
    class_name: "HEALTH 902",
    class_title: "Clinical Practice for a Rehabilitation Therapy Aide 0 units"
  },
  {
    class_number: "7041",
    class_time: "6:30 p.m.  -  9:35 p.m. TTh",
    class_location: "BUNDY 440",
    class_instructor: "Staff",
    class_name: "HEALTH 904",
    class_title: "Kinesiology for a Rehabilitation Therapy Aide 0 units"
  },
  {
    class_number: "7048",
    class_time: "9 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 335",
    class_instructor: "Emel C D",
    class_name: "HEALTH 905",
    class_title: "Providing Care to Older Adults 0 units"
  },
  {
    class_number: "7049",
    class_time: "9 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 335",
    class_instructor: "Emel C D",
    class_name: "HEALTH 906",
    class_title: "Communication with Older Adults 0 units"
  },
  {
    class_number: "7050",
    class_time: "9 a.m. - 12:30 p.m. S",
    class_location: "BUNDY 335",
    class_instructor: "Emel C D",
    class_name: "HEALTH 907",
    class_title: "Wellness in Older Adults 0 units"
  },
  {
    class_number: "2434",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CPC 104",
    class_instructor: "Strong L M",
    class_name: "HEALTH 10",
    class_title: "Fundamentals of Healthful Living 3 units"
  },
  {
    class_number: "2443",
    class_time: "11 a.m.  -  1:05 p.m. MW",
    class_location: "CPC 104",
    class_instructor: "Shima T H",
    class_name: "HEALTH 11",
    class_title: "First Aid and Cardio-Pulmonary Resuscitation 3 units"
  },
  {
    class_number: "3512",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Carbajal E",
    class_name: "HEALTH 60",
    class_title: "Multicultural Health and Healing Practices 3 units"
  },
  {
    class_number: "2444",
    class_time: "3 p.m.  -  6:05 p.m. W",
    class_location: "BUNDY 335",
    class_instructor: "Rees D M",
    class_name: "HEALTH 61",
    class_title: "Medical Terminology 3 units"
  },
  {
    class_number: "4223",
    class_time: "5 p.m.  -  7:25 p.m. TTh",
    class_location: "HSS 203",
    class_instructor: "Margolis F S",
    class_name: "HEBREW 1",
    class_title: "Elementary Hebrew I 5 units"
  },
  {
    class_number: "4224",
    class_time: "6:30 p.m.  -  8:55 p.m. TTh",
    class_location: "MC 12",
    class_instructor: "Zwang-Weissman",
    class_name: "HEBREW 2",
    class_title: "Elementary Hebrew II 5 units"
  },
  {
    class_number: "3562",
    class_time: "3:30 p.m.  -  4:35 p.m. TTh",
    class_location: "DRSCHR 213",
    class_instructor: "Margolis F S",
    class_name: "HEBREW 8",
    class_title: "Conversational Hebrew 2 units"
  },
  {
    class_number: "2446",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 253",
    class_instructor: "Byrne D",
    class_name: "HIST 1",
    class_title: "History of Western Civilization I 3 units"
  },
  {
    class_number: "2455",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "BUS 201",
    class_instructor: "Manoff R J",
    class_name: "HIST 2",
    class_title: "History of Western Civilization II 3 units"
  },
  {
    class_number: "3560",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Stiles C L",
    class_name: "HIST 4",
    class_title: "British Civilization II 3 units"
  },
  {
    class_number: "2462",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "HSS 104",
    class_instructor: "Garcia R M",
    class_name: "HIST 5",
    class_title: "History of Latin America 1 3 units"
  },
  {
    class_number: "2463",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 106",
    class_instructor: "Kawaguchi L A",
    class_name: "HIST 10",
    class_title: "Ethnicity and American Culture 3 units"
  },
  {
    class_number: "2475",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 205",
    class_instructor: "Moreno M",
    class_name: "HIST 11",
    class_title: "United States History through Reconstruction 3 units"
  },
  {
    class_number: "2484",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 105",
    class_instructor: "Amerian-Donnell S M",
    class_name: "HIST 12",
    class_title: "The United States History Since Reconstruction 3 units"
  },
  {
    class_number: "2493",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 106",
    class_instructor: "Kawaguchi L A",
    class_name: "HIST 14",
    class_title: "U.S. Environmental History 3 units"
  },
  {
    class_number: "2495",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 263",
    class_instructor: "Rabach E R",
    class_name: "HIST 15",
    class_title: "Economic History of the U.S. 3 units"
  },
  {
    class_number: "2497",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 103",
    class_instructor: "Clayborne D",
    class_name: "HIST 16",
    class_title: "African-American History 3 units"
  },
  {
    class_number: "2499",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 106",
    class_instructor: "Wilkinson Jr E C",
    class_name: "HIST 20",
    class_title: "History of California 3 units"
  },
  {
    class_number: "2500",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 103",
    class_instructor: "Yeganehshakib R",
    class_name: "HIST 22",
    class_title: "History of the Middle East 3 units"
  },
  {
    class_number: "2501",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "HSS 103",
    class_instructor: "Reilly B J",
    class_name: "HIST 25",
    class_title: "History of East Asia Since 1600 3 units"
  },
  {
    class_number: "2502",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 204",
    class_instructor: "Fouser D C",
    class_name: "HIST 32",
    class_title: "Global Environmental History 3 units"
  },
  {
    class_number: "2503",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reilly B J",
    class_name: "HIST 33",
    class_title: "World Civilizations I 3 units"
  },
  {
    class_number: "2504",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 103",
    class_instructor: "Reilly B J",
    class_name: "HIST 34",
    class_title: "World Civilizations II 3 units"
  },
  {
    class_number: "2507",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bolelli D",
    class_name: "HIST 41",
    class_title: "Native-American History 3 units"
  },
  {
    class_number: "2508",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 205",
    class_instructor: "Moreno M",
    class_name: "HIST 42",
    class_title: "The Latina/o Experience in the United States 3 units"
  },
  {
    class_number: "2510",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 204",
    class_instructor: "Amerian-Donnell S M",
    class_name: "HIST 52",
    class_title: "The History of Women in American Culture 3 units"
  },
  {
    class_number: "2511",
    class_time: "2:15 p.m.  -  3:35 p.m. M",
    class_location: "HSS 106",
    class_instructor: "Bolelli D",
    class_name: "HIST 53",
    class_title: "The History of Religion 3 units"
  },
  {
    class_number: "2512",
    class_time: "Arrange  -  1 Hour ",
    class_location: "HSS 305",
    class_instructor: "Chi J S",
    class_name: "HIST 88A",
    class_title: "Independent Studies in History 1 unit"
  },
  {
    class_number: "2513",
    class_time: "Arrange  -  2 Hours ",
    class_location: "HSS 305",
    class_instructor: "Chi J S",
    class_name: "HIST 88B",
    class_title: "Independent Studies in History 2 units"
  },
  {
    class_number: "9734",
    class_time: "1 p.m.  -  3:15 p.m. Th",
    class_location: "EC 1227 407",
    class_instructor: "Ross M A",
    class_name: "CT E00",
    class_title: "The Fix-It Class - Repair Almost Anything"
  },
  {
    class_number: "9783",
    class_time: "12 p.m.  -  2:50 p.m. M",
    class_location: "BUNDY 151",
    class_instructor: "Lewis K",
    class_name: "HME EC E01",
    class_title: "Sewing Lab"
  },
  {
    class_number: "9830",
    class_time: "11:30 a.m.  -  1:50 p.m. M",
    class_location: " ITINERY",
    class_instructor: "Salgado G",
    class_name: "HME EC E52",
    class_title:
      "Restaurant Critic - Dining Wisely: Healthy Eating Choices for Older Adults"
  },
  {
    class_number: "9785",
    class_time: "1:30 p.m.  -  2:45 p.m. TTh",
    class_location: "EC 1227 408",
    class_instructor: "Albert G S",
    class_name: "HUMDEV E06",
    class_title:
      "Enjoy Life - Understanding Our Mind, Body & Brain for Senior Adults"
  },
  {
    class_number: "9788",
    class_time: "11:30 a.m.  -  1:20 p.m. W",
    class_location: "EC 1227 107",
    class_instructor: "Abatemarco A M",
    class_name: "HUMDEV E22",
    class_title:
      "Senior Seminar: Through a Jewish Lens - Art, Culture & Entertainment"
  },
  {
    class_number: "9789",
    class_time: "1:30 p.m.  -  3:20 p.m. M",
    class_location: "EC 1227 407",
    class_instructor: "Press P L",
    class_name: "HUMDEV E24",
    class_title: "Bereavement Support"
  },
  {
    class_number: "9790",
    class_time: "12:30 p.m.  -  2:20 p.m. T",
    class_location: "EC 1227 407",
    class_instructor: "Frand L",
    class_name: "HUMDEV E25",
    class_title: "Dealing with Hearing Impairment"
  },
  {
    class_number: "9791",
    class_time: "10 a.m. - 11:50 a.m. T",
    class_location: "EC 1227 407",
    class_instructor: "Frand L",
    class_name: "HUMDEV E27",
    class_title: "Exercising the Brain"
  },
  {
    class_number: "9794",
    class_time: "12 p.m.  -  1:30 p.m. W",
    class_location: "EC 1227 208",
    class_instructor: "Feinberg L H",
    class_name: "HUMDEV E28",
    class_title: "Communication After a Stroke (Computer Based)"
  },
  {
    class_number: "9795",
    class_time: "10:30 a.m. - 11:45 a.m. W",
    class_location: "EC 1227 408",
    class_instructor: "Feinberg L H",
    class_name: "HUMDEV E50",
    class_title: "Communication After a Stroke"
  },
  {
    class_number: "9823",
    class_time: "11 a.m. - 12:50 p.m. M",
    class_location: "EC 1227 408",
    class_instructor: "Press P L",
    class_name: "PSYCH E33",
    class_title: "Living as a Single Person"
  },
  {
    class_number: "5402",
    class_time: "6:30 p.m.  -  9:35 p.m. Th",
    class_location: "CMD 271",
    class_instructor: "Safioulline M",
    class_name: "IXD 330",
    class_title: "Interaction Design Studio 2 3 units"
  },
  {
    class_number: "5403",
    class_time: "6:30 p.m.  -  9:35 p.m. T",
    class_location: "CMD 271",
    class_instructor: "Staff",
    class_name: "IXD 360",
    class_title: "Product Design 3 units"
  },
  {
    class_number: "5003",
    class_time: "Arrange - 7.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Johnson L D",
    class_name: "IXD 410",
    class_title: "Project Management for Design 2 units"
  },
  {
    class_number: "5404",
    class_time: "6:30 p.m.  -  9:35 p.m. M",
    class_location: "CMD 271",
    class_instructor: "Chan N R",
    class_name: "IXD 430",
    class_title: "Interaction Design Studio 3 3 units"
  },
  {
    class_number: "5405",
    class_time: "6:30 p.m.  -  9:35 p.m. W",
    class_location: "CMD 271",
    class_instructor: "Johnson L D",
    class_name: "IXD 470",
    class_title: "Interaction Design Senior Studio 3 units"
  },
  {
    class_number: "5004",
    class_time: "Arrange  -  4 Hours ",
    class_location: " ",
    class_instructor: "Chan N R",
    class_name: "IXD 491",
    class_title: "Interaction Design Internship 1 unit"
  },
  {
    class_number: "5006",
    class_time: "Arrange  -  7 Hours ",
    class_location: " ",
    class_instructor: "Chan N R",
    class_name: "IXD 492",
    class_title: "Interaction Design Internship 2 units"
  },
  {
    class_number: "5008",
    class_time: "Arrange - 10 Hours ",
    class_location: " ",
    class_instructor: "Chan N R",
    class_name: "IXD 493",
    class_title: "Interaction Design Internship 3 units"
  },
  {
    class_number: "3588",
    class_time: "9 a.m.  -  1:15 p.m. TF",
    class_location: "CMD 124",
    class_instructor: "Soto A J",
    class_name: "INTARC 28B",
    class_title: "Visual Studies 2 3 units"
  },
  {
    class_number: "2517",
    class_time: "9:30 a.m. - 12:35 p.m. MW",
    class_location: "CMD 272",
    class_instructor: "Rabkin B L",
    class_name: "INTARC 31",
    class_title: "Interior Architectural Design Studio 1 3 units"
  },
  {
    class_number: "2519",
    class_time: "2 p.m.  -  5:05 p.m. Th",
    class_location: "CMD 272",
    class_instructor: "Gregory D K",
    class_name: "INTARC 33",
    class_title: "Interior Architectural Design Career and Portfolio 3 units"
  },
  {
    class_number: "2520",
    class_time: "9:30 a.m.  -  3:35 p.m. S",
    class_location: "CMD 286",
    class_instructor: "Adair J S",
    class_name: "INTARC 34",
    class_title: "2D Color Theory 3 units"
  },
  {
    class_number: "2521",
    class_time: "9 a.m. - 12:05 p.m. W",
    class_location: "CMD 286",
    class_instructor: "Cordova S A",
    class_name: "INTARC 34B",
    class_title: "3D Applied Design Theory 3 units"
  },
  {
    class_number: "2523",
    class_time: "9:30 a.m.  -  3:35 p.m. S",
    class_location: "CMD 208",
    class_instructor: "Pena I",
    class_name: "INTARC 35",
    class_title: "2D Digital Drafting 3 units"
  },
  {
    class_number: "2525",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Hao J Y",
    class_name: "INTARC 36",
    class_title: "Interior Architectural Design Materials and Products 3 units"
  },
  {
    class_number: "2526",
    class_time: "Arrange  -  9 Hours ",
    class_location: " ONLINE",
    class_instructor: "Gensler A H",
    class_name: "INTARC 38",
    class_title: "3D Digital Drafting 1 3 units"
  },
  {
    class_number: "2527",
    class_time: "2 p.m.  -  5:05 p.m. T",
    class_location: "CMD 272",
    class_instructor: "Cooley S",
    class_name: "INTARC 39",
    class_title: "Green Design for Interiors 3 units"
  },
  {
    class_number: "2528",
    class_time: "9 a.m.  -  1:30 p.m. T",
    class_location: "CMD 272",
    class_instructor: "Hao J Y",
    class_name: "INTARC 40",
    class_title: "Interior Architectural Design Studio 2 3 units"
  },
  {
    class_number: "2529",
    class_time: "9 a.m.  -  1:30 p.m. Th",
    class_location: "CMD 272",
    class_instructor: "Cordova S A",
    class_name: "INTARC 45",
    class_title: "Interior Architectural Design Studio 3 3 units"
  },
  {
    class_number: "2530",
    class_time: "2 p.m.  -  8:10 p.m. F",
    class_location: "CMD 272",
    class_instructor: "Dunphy B E",
    class_name: "INTARC 52",
    class_title: "Production Design for Film and TV 3 units"
  },
  {
    class_number: "4430",
    class_time: "6:30 p.m.  -  9:35 p.m. TTh",
    class_location: "CMD 208",
    class_instructor: "Staff",
    class_name: "INTARC 57",
    class_title: "3D Digital Drafting 2 3 units"
  },
  {
    class_number: "2534",
    class_time: "9:30 a.m. - 11 a.m. MWF",
    class_location: "MC 16",
    class_instructor: "Weisberg A N",
    class_name: "ITAL 1",
    class_title: "Elementary Italian I 5 units"
  },
  {
    class_number: "2536",
    class_time: "2:30 p.m.  -  4:55 p.m. MW",
    class_location: "LA 214",
    class_instructor: "Lorenzi P",
    class_name: "ITAL 2",
    class_title: "Elementary Italian II 5 units"
  },
  {
    class_number: "2538",
    class_time: "9:30 a.m. - 11 a.m. MWF",
    class_location: "LA 214",
    class_instructor: "Comrie A K",
    class_name: "JAPAN 1",
    class_title: "Elementary Japanese I 5 units"
  },
  {
    class_number: "2543",
    class_time: "5 p.m.  -  7:25 p.m. MW",
    class_location: "MC 1",
    class_instructor: "Kroupa R A",
    class_name: "JAPAN 2",
    class_title: "Elementary Japanese II 5 units"
  },
  {
    class_number: "4233",
    class_time: "7:30 p.m.  -  9:55 p.m. MW",
    class_location: "DRSCHR 221",
    class_instructor: "Takemori K",
    class_name: "JAPAN 3",
    class_title: "Intermediate Japanese I 5 units"
  },
  {
    class_number: "4234",
    class_time: "12:45 p.m.  -  3:10 p.m. TTh",
    class_location: "DRSCHR 208",
    class_instructor: "Tsuboi Y",
    class_name: "JAPAN 4",
    class_title: "Intermediate Japanese II 5 units"
  },
  {
    class_number: "2547",
    class_time: "2:45 p.m.  -  3:50 p.m. MW",
    class_location: "MC 8",
    class_instructor: "Kroupa R A",
    class_name: "JAPAN 8",
    class_title: "Conversational Japanese 2 units"
  },
  {
    class_number: "2548",
    class_time: "1 p.m.  -  2:20 p.m. MW",
    class_location: "MC 12",
    class_instructor: "Minekawa Y",
    class_name: "JAPAN 9",
    class_title: "Japan: Culture and Civilization 3 units"
  },
  {
    class_number: "2551",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "CMD 131",
    class_instructor: "Rubin S M",
    class_name: "JOURN 1",
    class_title: "The News 3 units"
  },
  {
    class_number: "4235",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "CMD 202",
    class_instructor: "Obsatz S B",
    class_name: "JOURN 2",
    class_title: "Intermediate Newswriting and Reporting 3 units"
  },
  {
    class_number: "2556",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "CMD 131",
    class_instructor: "Rubin S M",
    class_name: "JOURN 15",
    class_title: "Introduction to Multimedia Storytelling 3 units"
  },
  {
    class_number: "2558",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "CMD 130",
    class_instructor: "Blaize-Hopkins A N",
    class_name: "JOURN 16",
    class_title: "Producing the Campus Newspaper 4 units"
  },
  {
    class_number: "2559",
    class_time: "4 p.m.  -  8:05 p.m. M",
    class_location: "CMD 130",
    class_instructor: "Blaize-Hopkins A N",
    class_name: "JOURN 17",
    class_title: "Editing the Campus Newspaper 2 units"
  },
  {
    class_number: "2561",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "CMD 128",
    class_instructor: "Burkhart G J",
    class_name: "JOURN 21",
    class_title: "News Photography 3 units"
  },
  {
    class_number: "2562",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "CMD 131",
    class_instructor: "Burkhart G J",
    class_name: "JOURN 22",
    class_title: "Photography for Publication 3 units"
  },
  {
    class_number: "4236",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "CMD 205",
    class_instructor: "Adelman A",
    class_name: "JOURN 43",
    class_title: "Public Relations and Publicity 3 units"
  },
  {
    class_number: "2564",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "LS 101",
    class_instructor: "Metzler K A",
    class_name: "KIN PE 3",
    class_title: "Introduction to Exercise Physiology I 3 units"
  },
  {
    class_number: "2565",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "LS 101",
    class_instructor: "Metzler K A",
    class_name: "KIN PE 4",
    class_title: "Introduction to Sport Psychology 3 units"
  },
  {
    class_number: "2622",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " POOL",
    class_instructor: "Cascino N V",
    class_name: "KIN PE 48A",
    class_title: "Beginning Swimming 1 unit"
  },
  {
    class_number: "2624",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: " POOL",
    class_instructor: "Bullock J A",
    class_name: "KIN PE 48B",
    class_title: "Elementary Swimming 1 unit"
  },
  {
    class_number: "2626",
    class_time: "6 a.m.  -  7:20 a.m. MW",
    class_location: " POOL",
    class_instructor: "Contarsy S A",
    class_name: "KIN PE 48C",
    class_title: "Intermediate Swimming 1 unit"
  },
  {
    class_number: "2629",
    class_time: "6 a.m.  -  7:20 a.m. MW",
    class_location: " POOL",
    class_instructor: "Contarsy S A",
    class_name: "KIN PE 48D",
    class_title: "Advanced Swimming 1 unit"
  },
  {
    class_number: "2631",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " POOL",
    class_instructor: "King R L",
    class_name: "KIN PE 49A",
    class_title: "Board Diving 1 unit"
  },
  {
    class_number: "2632",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: " POOL",
    class_instructor: "Eskridge B M",
    class_name: "KIN PE 50A",
    class_title: "Beginning Water Polo 1 unit"
  },
  {
    class_number: "2633",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: " POOL",
    class_instructor: "Eskridge B M",
    class_name: "KIN PE 50C",
    class_title: "Advanced Water Polo 1 unit"
  },
  {
    class_number: "2634",
    class_time: "9:30 a.m. - 12:35 p.m. MW",
    class_location: " BEACH",
    class_instructor: "King R L",
    class_name: "KIN PE 51A",
    class_title: "Beginning Surfing 1 unit"
  },
  {
    class_number: "2636",
    class_time: "9:30 a.m. - 12:35 p.m. MW",
    class_location: " BEACH",
    class_instructor: "King R L",
    class_name: "KIN PE 51B",
    class_title: "Intermediate Surfing 1 unit"
  },
  {
    class_number: "2605",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Baghdasarian G",
    class_name: "KIN PE 34A",
    class_title: "Karate 1 unit"
  },
  {
    class_number: "2606",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Baghdasarian G",
    class_name: "KIN PE 34B",
    class_title: "Intermediate Karate 1 unit"
  },
  {
    class_number: "2607",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Baghdasarian G",
    class_name: "KIN PE 34C",
    class_title: "Advanced Intermediate Karate 1 unit"
  },
  {
    class_number: "2608",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Baghdasarian G",
    class_name: "KIN PE 34D",
    class_title: "Advanced Karate 1 unit"
  },
  {
    class_number: "2609",
    class_time: "3:45 p.m.  -  5:15 p.m. T",
    class_location: "CPC 104",
    class_instructor: "Levy B",
    class_name: "KIN PE 41M",
    class_title: "Self Defense - Men 1 unit"
  },
  {
    class_number: "2610",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CPC 218",
    class_instructor: "Eastcott M B",
    class_name: "KIN PE 41W",
    class_title: "Self Defense - Women 1 unit"
  },
  {
    class_number: "2563",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "CPC 104",
    class_instructor: "Metzler K A",
    class_name: "KIN PE 2",
    class_title: "Achieving Lifetime Fitness 3 units"
  },
  {
    class_number: "2571",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "CPC 201",
    class_instructor: "Ocampo J M",
    class_name: "KIN PE 10A",
    class_title: "Fitness Lab 1 unit"
  },
  {
    class_number: "2577",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CPC 201",
    class_instructor: "Staff",
    class_name: "KIN PE 10C",
    class_title: "Advanced Fitness Lab 1 unit"
  },
  {
    class_number: "2581",
    class_time: "6:30 a.m.  -  7:50 a.m. MW",
    class_location: "CPC 207",
    class_instructor: "Seymour P S",
    class_name: "KIN PE 11A",
    class_title: "Beginning Weight Training 1 unit"
  },
  {
    class_number: "2585",
    class_time: "6:30 a.m.  -  7:50 a.m. MW",
    class_location: "CPC 207",
    class_instructor: "Seymour P S",
    class_name: "KIN PE 11B",
    class_title: "Intermediate Weight Training 1 unit"
  },
  {
    class_number: "2587",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "CPC 207",
    class_instructor: "Barnett R T",
    class_name: "KIN PE 11C",
    class_title: "Advanced Weight Training 1 unit"
  },
  {
    class_number: "2589",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "GYM 2",
    class_instructor: "Hank M E",
    class_name: "KIN PE 12",
    class_title: "Olympic-Style Weightlifting 1 unit"
  },
  {
    class_number: "2596",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Strong L M",
    class_name: "KIN PE 17",
    class_title: "Boxing for Fitness 1 unit"
  },
  {
    class_number: "2598",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "CPC 207",
    class_instructor: "Seymour P S",
    class_name: "KIN PE 19C",
    class_title: "Fitness - Body Level Exercises 1 unit"
  },
  {
    class_number: "2600",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: " POOL",
    class_instructor: "Shima T H",
    class_name: "KIN PE 19D",
    class_title: "Fitness - Aquatic Exercises 1 unit"
  },
  {
    class_number: "2602",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "CPC 216",
    class_instructor: "Chavez E C",
    class_name: "KIN PE 19E",
    class_title: "Pilates Mat Exercise 1 unit"
  },
  {
    class_number: "2651",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "CPC 216",
    class_instructor: "Bennett J L",
    class_name: "KIN PE 58A",
    class_title: "Beginning Yoga 1 unit"
  },
  {
    class_number: "2658",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "CPC 218",
    class_instructor: "Sandoval H J",
    class_name: "KIN PE 58B",
    class_title: "Intermediate Yoga 1 unit"
  },
  {
    class_number: "2667",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "CPC 216",
    class_instructor: "Huner K A",
    class_name: "KIN PE 58C",
    class_title: "Advanced Yoga 1 unit"
  },
  {
    class_number: "2672",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Roque E M",
    class_name: "KIN PE 88A",
    class_title: "Independent Studies in Physical Education 1 unit"
  },
  {
    class_number: "2566",
    class_time: "11 a.m. - 12:20 p.m. MW",
    class_location: "GYM 100",
    class_instructor: "Kalafer F",
    class_name: "KIN PE 5B",
    class_title: "Intermediate Badminton 1 unit"
  },
  {
    class_number: "4238",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "GYM 100",
    class_instructor: "Dumitriu E",
    class_name: "KIN PE 5C",
    class_title: "Advanced Badminton 1 unit"
  },
  {
    class_number: "2590",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: " TRACK",
    class_instructor: "Barron E A",
    class_name: "KIN PE 14",
    class_title: "Cross Country 1 unit"
  },
  {
    class_number: "2591",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: " TRACK",
    class_instructor: "Barron E A",
    class_name: "KIN PE 14B",
    class_title: "Intermediate Cross Country 1 unit"
  },
  {
    class_number: "2592",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: " TRACK",
    class_instructor: "Barron E A",
    class_name: "KIN PE 14C",
    class_title: "Advanced Cross Country 1 unit"
  },
  {
    class_number: "2593",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "CPC 201",
    class_instructor: "Eastcott M B",
    class_name: "KIN PE 16A",
    class_title: "Beginning Rock Climbing 1 unit"
  },
  {
    class_number: "2595",
    class_time: "11:30 a.m.  -  2:35 p.m. F",
    class_location: "CPC 201",
    class_instructor: "Eastcott M B",
    class_name: "KIN PE 16B",
    class_title: "Intermediate Rock Climbing 1 unit"
  },
  {
    class_number: "2604",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: " WSTCHSTR",
    class_instructor: "Ralston L C",
    class_name: "KIN PE 25A",
    class_title: "Beginning Golf 1 unit"
  },
  {
    class_number: "4243",
    class_time: "6:45 p.m.  -  8:05 p.m. MW",
    class_location: " WSTCHSTR",
    class_instructor: "Ralston L C",
    class_name: "KIN PE 25B",
    class_title: "Intermediate Golf 1 unit"
  },
  {
    class_number: "4244",
    class_time: "6:45 p.m.  -  8:05 p.m. MW",
    class_location: " WSTCHSTR",
    class_instructor: "Ralston L C",
    class_name: "KIN PE 25C",
    class_title: "Advanced Golf 1 unit"
  },
  {
    class_number: "4245",
    class_time: "6:45 p.m.  -  8:05 p.m. MW",
    class_location: " WSTCHSTR",
    class_instructor: "Ralston L C",
    class_name: "KIN PE 25D",
    class_title: "Golf Player Development 1 unit"
  },
  {
    class_number: "2638",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "GYM 100",
    class_instructor: "Livshin B S",
    class_name: "KIN PE 53A",
    class_title: "Table Tennis 1 unit"
  },
  {
    class_number: "2639",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "GYM 100",
    class_instructor: "Livshin B S",
    class_name: "KIN PE 53B",
    class_title: "Intermediate Table Tennis 1 unit"
  },
  {
    class_number: "2640",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " MEMOR PK",
    class_instructor: "Lemon D R",
    class_name: "KIN PE 54A",
    class_title: "Beginning Tennis, First Level 1 unit"
  },
  {
    class_number: "2642",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " MEMOR PK",
    class_instructor: "Lemon D R",
    class_name: "KIN PE 54B",
    class_title: "Beginning Tennis, Second Level 1 unit"
  },
  {
    class_number: "2644",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: " MEMOR PK",
    class_instructor: "Molsing J P",
    class_name: "KIN PE 54C",
    class_title: "Intermediate Tennis 1 unit"
  },
  {
    class_number: "2645",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: " MEMOR PK",
    class_instructor: "Molsing J P",
    class_name: "KIN PE 54D",
    class_title: "Advanced Tennis 1 unit"
  },
  {
    class_number: "2646",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: " FIELD",
    class_instructor: "Ankeny K L",
    class_name: "KIN PE 56A",
    class_title: "Beginning Track and Field 1 unit"
  },
  {
    class_number: "2647",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: " FIELD",
    class_instructor: "Ankeny K L",
    class_name: "KIN PE 56B",
    class_title: "Intermediate Track and Field 1 unit"
  },
  {
    class_number: "2567",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "GYM 100",
    class_instructor: "Barnett R T",
    class_name: "KIN PE 9A",
    class_title: "Beginning Basketball 1 unit"
  },
  {
    class_number: "2568",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "GYM 100",
    class_instructor: "Maidenberg J D",
    class_name: "KIN PE 9B",
    class_title: "Intermediate Basketball 1 unit"
  },
  {
    class_number: "2569",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "GYM 100",
    class_instructor: "Staff",
    class_name: "KIN PE 9C",
    class_title: "Advanced Basketball 1 unit"
  },
  {
    class_number: "2603",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: " FIELD",
    class_instructor: "Barnett R T",
    class_name: "KIN PE 21",
    class_title: "Coed Touch Football 1 unit"
  },
  {
    class_number: "4242",
    class_time: "5:15 p.m.  -  6:35 p.m. MTWTh",
    class_location: " FIELD",
    class_instructor: "Staff",
    class_name: "KIN PE 21C",
    class_title: "Advanced Football for Men 1 unit"
  },
  {
    class_number: "2613",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: " FIELD",
    class_instructor: "Benditson A",
    class_name: "KIN PE 43A",
    class_title: "Beginning Soccer 1 unit"
  },
  {
    class_number: "2614",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: " FIELD",
    class_instructor: "Seymour P S",
    class_name: "KIN PE 43B",
    class_title: "Intermediate Soccer 1 unit"
  },
  {
    class_number: "2616",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: " FIELD",
    class_instructor: "Seymour P S",
    class_name: "KIN PE 43C",
    class_title: "Advanced Soccer 1 unit"
  },
  {
    class_number: "2619",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: " FIELD",
    class_instructor: "Pierce T L",
    class_name: "KIN PE 43D",
    class_title: "Competitive Soccer 1 unit"
  },
  {
    class_number: "2648",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "GYM 100",
    class_instructor: "Roque E M",
    class_name: "KIN PE 57A",
    class_title: "Beginning Volleyball 1 unit"
  },
  {
    class_number: "2649",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "GYM 100",
    class_instructor: "Roque E M",
    class_name: "KIN PE 57B",
    class_title: "Intermediate Volleyball 1 unit"
  },
  {
    class_number: "2650",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "GYM 100",
    class_instructor: "Roque E M",
    class_name: "KIN PE 57C",
    class_title: "Advanced Volleyball 1 unit"
  },
  {
    class_number: "2670",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " BEACH",
    class_instructor: "Pierce T L",
    class_name: "KIN PE 59A",
    class_title: "Beginning Beach Volleyball 1 unit"
  },
  {
    class_number: "2671",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " BEACH",
    class_instructor: "Pierce T L",
    class_name: "KIN PE 59B",
    class_title: "Intermediate Beach Volleyball 1 unit"
  },
  {
    class_number: "2674",
    class_time: "9:30 a.m. - 11 a.m. TThF",
    class_location: "MC 2",
    class_instructor: "Lee J M",
    class_name: "KOREAN 1",
    class_title: "Elementary Korean I 5 units"
  },
  {
    class_number: "4249",
    class_time: "5 p.m.  -  7:25 p.m. MW",
    class_location: "MC 2",
    class_instructor: "Tark E",
    class_name: "KOREAN 2",
    class_title: "Elementary Korean II 5 units"
  },
  {
    class_number: "2676",
    class_time: "9:30 a.m. - 11 a.m. TThF",
    class_location: "DRSCHR 208",
    class_instructor: "Tark E",
    class_name: "KOREAN 4",
    class_title: "Intermediate Korean 2 5 units"
  },
  {
    class_number: "2679",
    class_time: "12:45 p.m.  -  1:50 p.m. MW",
    class_location: "LIB 192",
    class_instructor: "Carpenter M K",
    class_name: "LIBR 1",
    class_title: "Library Research Methods 1 unit"
  },
  {
    class_number: "2681",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 203",
    class_instructor: "Thomas Ja",
    class_name: "LING 1",
    class_title: "Introduction to Linguistics 3 units"
  },
  {
    class_number: "9731",
    class_time: "9 a.m. - 10:50 a.m. F",
    class_location: " VP TERRY",
    class_instructor: "Quinones H C",
    class_name: "BILING E01",
    class_title: "Literature in Spanish"
  },
  {
    class_number: "9732",
    class_time: "2 p.m.  -  3:50 p.m. T",
    class_location: "EC 1227 409",
    class_instructor: "Isner-Ball D R",
    class_name: "BILING E02",
    class_title: "French Literature"
  },
  {
    class_number: "9733",
    class_time: "1:30 p.m.  -  3:20 p.m. W",
    class_location: "EC 1227 409",
    class_instructor: "Reich S L",
    class_name: "BILING E03",
    class_title: "Literature from Around the World"
  },
  {
    class_number: "9735",
    class_time: "2 p.m.  -  3:50 p.m. M",
    class_location: "EC 1227 409",
    class_instructor: "Dwyer F",
    class_name: "ENGL E20",
    class_title: "Literature: The Novel"
  },
  {
    class_number: "9736",
    class_time: "10 a.m. - 11:50 a.m. T",
    class_location: "EC 1227 408",
    class_instructor: "Wali M",
    class_name: "ENGL E22",
    class_title: "Short Story"
  },
  {
    class_number: "9737",
    class_time: "9 a.m. - 10:50 a.m. M",
    class_location: "EC 1227 107",
    class_instructor: "Achorn J C",
    class_name: "ENGL E23",
    class_title: "Shakespeare"
  },
  {
    class_number: "9739",
    class_time: "2 p.m.  -  3:50 p.m. Th",
    class_location: " SM SYNG",
    class_instructor: "Marx J A",
    class_name: "ENGL E24",
    class_title: "Bible as Literature"
  },
  {
    class_number: "9740",
    class_time: "9 a.m. - 10:50 a.m. T",
    class_location: "EC 1227 107",
    class_instructor: "Achorn J C",
    class_name: "ENGL E25",
    class_title: "Literature: The American Novel"
  },
  {
    class_number: "9742",
    class_time: "11:30 a.m.  -  1:20 p.m. M",
    class_location: "EC 1227 409",
    class_instructor: "Dwyer F",
    class_name: "ENGL E29",
    class_title: "Greek Literature"
  },
  {
    class_number: "2686",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "MC 70",
    class_instructor: "Ross K R",
    class_name: "MATH 1",
    class_title: "Bridge to College Mathematics 5 units"
  },
  {
    class_number: "2749",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "MC 70",
    class_instructor: "Ross K R",
    class_name: "MATH 1B",
    class_title: "Bridge to College Mathematics 2 5 units"
  },
  {
    class_number: "2760",
    class_time: "7:45 a.m. - 10:50 a.m. MW",
    class_location: "MC 70",
    class_instructor: "Ross K R",
    class_name: "MATH 1C",
    class_title: "Bridge to College Mathematics 3 5 units"
  },
  {
    class_number: "2702",
    class_time: "9:30 a.m. - 11:55 a.m. MW",
    class_location: "LA 228",
    class_instructor: "Harjuno T",
    class_name: "MATH 2",
    class_title: "Precalculus 5 units"
  },
  {
    class_number: "2697",
    class_time: "7 a.m.  -  8:05 a.m. MTWTh",
    class_location: "LS 103",
    class_instructor: "Lee P H",
    class_name: "MATH    2",
    class_title:
      "Precalculus with MATH   2C: Concurrent Support for Precalculus7 units "
  },
  {
    class_number: "2708",
    class_time: "8 a.m.  -  9:20 a.m. MTWTh",
    class_location: "MC 10",
    class_instructor: "Ouellette K R",
    class_name: "MATH 3",
    class_title: "Trigonometry with Applications 3 units"
  },
  {
    class_number: "2707",
    class_time: "7 a.m.  -  8:20 a.m. MW",
    class_location: "LS 205",
    class_instructor: "Jimenez B S",
    class_name: "MATH    3",
    class_title:
      "Trigonometry with Applications with MATH   3C: Concurrent Support for Trigonometry with Applications4 units "
  },
  {
    class_number: "2713",
    class_time: "8 a.m. - 10:05 a.m. MTWTh",
    class_location: "MC 11",
    class_instructor: "Nguyen D T",
    class_name: "MATH 4",
    class_title: "College Algebra for STEM Majors 4 units"
  },
  {
    class_number: "2714",
    class_time: "8 a.m. - 10:05 a.m. MW",
    class_location: "LS 203",
    class_instructor: "Bene A J",
    class_name: "MATH    4",
    class_title:
      "College Algebra for STEM Majors with MATH   4C: Concurrent Support for College Algebra for STEM Majors5 units "
  },
  {
    class_number: "2719",
    class_time: "8:15 a.m.  -  9:20 a.m. MTWTh",
    class_location: "MC 82",
    class_instructor: "Rodas B G",
    class_name: "MATH 7",
    class_title: "Calculus 1 5 units"
  },
  {
    class_number: "2729",
    class_time: "8:15 a.m.  -  9:20 a.m. MTWTh",
    class_location: "LS 201",
    class_instructor: "Maldague J",
    class_name: "MATH 8",
    class_title: "Calculus 2 5 units"
  },
  {
    class_number: "2736",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "LS 103",
    class_instructor: "Lui-Martinez Kr D",
    class_name: "MATH 10",
    class_title: "Discrete Structures 3 units"
  },
  {
    class_number: "2738",
    class_time: "8:15 a.m.  -  9:20 a.m. MTWTh",
    class_location: "MC 1",
    class_instructor: "Herichi H",
    class_name: "MATH 11",
    class_title: "Multivariable Calculus 5 units"
  },
  {
    class_number: "2742",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "MC 74",
    class_instructor: "Edinger G C",
    class_name: "MATH 13",
    class_title: "Linear Algebra 3 units"
  },
  {
    class_number: "2744",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "MC 1",
    class_instructor: "Herichi H",
    class_name: "MATH 15",
    class_title: "Ordinary Differential Equations 3 units"
  },
  {
    class_number: "2746",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "MC 82",
    class_instructor: "Huang C Y",
    class_name: "MATH 18",
    class_title:
      "Intermediate Algebra for Statistics and Finite Mathematics 3 units"
  },
  {
    class_number: "2771",
    class_time: "7 a.m.  -  8:05 a.m. MTWTh",
    class_location: "MC 66",
    class_instructor: "Foster M",
    class_name: "MATH 20",
    class_title: "Intermediate Algebra 5 units"
  },
  {
    class_number: "2778",
    class_time: "6:30 a.m.  -  7:50 a.m. MW",
    class_location: "MC 67",
    class_instructor: "Cho M",
    class_name: "MATH 21",
    class_title: "Finite Mathematics 3 units"
  },
  {
    class_number: "2781",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "MC 66",
    class_instructor: "Konya W",
    class_name: "MATH   21",
    class_title:
      "Finite Mathematics with MATH   21C: Concurrent Support for Finite Mathematics4 units "
  },
  {
    class_number: "2790",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "BUNDY 416",
    class_instructor: "Rahnavard M H",
    class_name: "MATH 26",
    class_title:
      "Functions and Modeling for Business and Social Science 3 units"
  },
  {
    class_number: "2791",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "BUNDY 239",
    class_instructor: "Lopez J E",
    class_name: "MATH   26",
    class_title:
      "Functions and Modeling for Business and Social Science with MATH   26C: Concurrent Support for Functions and Modeling for Business and Social Science5 units "
  },
  {
    class_number: "2795",
    class_time: "9:30 a.m. - 10:35 a.m. MTWTh",
    class_location: "LA 231",
    class_instructor: "Maldague J",
    class_name: "MATH 28",
    class_title: "Calculus 1 for Business and Social Science 5 units"
  },
  {
    class_number: "2797",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "MC 82",
    class_instructor: "Rodas B G",
    class_name: "MATH 29",
    class_title: "Calculus 2 for Business and Social Science 3 units"
  },
  {
    class_number: "2803",
    class_time: "8:15 a.m. - 10:40 a.m. MW",
    class_location: "MC 67",
    class_instructor: "Cho M",
    class_name: "MATH 31",
    class_title: "Elementary Algebra 5 units"
  },
  {
    class_number: "2807",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "CMD 107",
    class_instructor: "Howe J E",
    class_name: "MATH 32",
    class_title: "Plane Geometry 3 units"
  },
  {
    class_number: "4284",
    class_time: "5:15 p.m.  -  8:20 p.m. Th",
    class_location: "BUNDY 416",
    class_instructor: "Perez-Fernandez L",
    class_name: "MATH 41",
    class_title: "Mathematics for Elementary School Teachers 3 units"
  },
  {
    class_number: "2815",
    class_time: "7 a.m. - 10:05 a.m. MW",
    class_location: "MC 83",
    class_instructor: "Gizaw A",
    class_name: "MATH 50",
    class_title: "Pre-Statistics 5 units"
  },
  {
    class_number: "2832",
    class_time: "7 a.m.  -  9:05 a.m. TTh",
    class_location: "BUNDY 217",
    class_instructor: "Graves L P",
    class_name: "MATH 54",
    class_title: "Elementary Statistics 4 units"
  },
  {
    class_number: "2831",
    class_time: "7 a.m.  -  9:05 a.m. MW",
    class_location: "MC 74",
    class_instructor: "Edinger G C",
    class_name: "MATH   54",
    class_title:
      "Elementary Statistics with MATH   54C: Concurrent Support for Elementary Statistics6 units "
  },
  {
    class_number: "2890",
    class_time: "Arrange  -  1 Hour ",
    class_location: "MC 26",
    class_instructor: "Mcgraw C K",
    class_name: "MATH 88A",
    class_title: "Independent Studies in Mathematics 1 unit"
  },
  {
    class_number: "2896",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "LS 106",
    class_instructor: "Charles H E",
    class_name: "MEDIA 1",
    class_title: "Survey of Mass Media Communications 3 units"
  },
  {
    class_number: "2914",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "LS 117",
    class_instructor: "Schofield J E",
    class_name: "MEDIA 2",
    class_title: "Reading Media: Acquiring Media Literacy Skills 3 units"
  },
  {
    class_number: "2915",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "LS 152",
    class_instructor: "Movius L",
    class_name: "MEDIA 3",
    class_title: "Global Media 3 units"
  },
  {
    class_number: "2917",
    class_time: "9 a.m. - 12:05 p.m. MW",
    class_location: "CMD 105",
    class_instructor: "Chicas H K",
    class_name: "MEDIA 4",
    class_title: "Introduction to Game Studies 3 units"
  },
  {
    class_number: "2919",
    class_time: "8 a.m. - 11:05 a.m. MW",
    class_location: "CMD 109",
    class_instructor: "Gougis M J",
    class_name: "MEDIA 10",
    class_title: "Media, Gender, and Race 3 units"
  },
  {
    class_number: "2933",
    class_time: "9:30 a.m. - 12:35 p.m. W",
    class_location: "CMD 131",
    class_instructor: "Shaw R D",
    class_name: "MEDIA 11",
    class_title: "Introduction to Broadcasting 3 units"
  },
  {
    class_number: "2935",
    class_time: "2:15 p.m.  -  3:15 p.m. T",
    class_location: "CMD 203",
    class_instructor: "Brewington R H",
    class_name: "MEDIA 13",
    class_title: "Broadcasting Announcing and Production 3 units"
  },
  {
    class_number: "4325",
    class_time: "6:45 p.m.  -  9:55 p.m. M",
    class_location: "CMD 182",
    class_instructor: "Carlucci M A",
    class_name: "MEDIA 17",
    class_title: "Sportscasting Spring Sports 3 units"
  },
  {
    class_number: "4326",
    class_time: "5:30 p.m.  -  9:50 p.m. Th",
    class_location: "CMD 209",
    class_instructor: "Adelman A",
    class_name: "MEDIA 18",
    class_title: "Broadcast Advertising 3 units"
  },
  {
    class_number: "2936",
    class_time: "11 a.m.  -  2:05 p.m. T",
    class_location: "CMD 205",
    class_instructor: "Prescott P N",
    class_name: "MEDIA 19",
    class_title: "Broadcasting Workshop 3 units"
  },
  {
    class_number: "2937",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Chicas H K",
    class_name: "MEDIA 20",
    class_title:
      "Introduction to Media Writing and Producing Short-form Content 3 units"
  },
  {
    class_number: "3518",
    class_time: "12 p.m.  -  1 p.m. MTWThF",
    class_location: " BHHS",
    class_instructor: "Carey R T",
    class_name: "MEDIA 21",
    class_title: "Short Form Visual Media Production 3 units"
  },
  {
    class_number: "2939",
    class_time: "12:45 p.m.  -  1:45 p.m. M",
    class_location: "CMD 105",
    class_instructor: "Fetzer G C",
    class_name: "MEDIA 46",
    class_title: "Television Production 3 units"
  },
  {
    class_number: "2940",
    class_time: "9:30 a.m. - 10:30 a.m. M",
    class_location: "CMD 131",
    class_instructor: "Shaw R D",
    class_name: "MEDIA 48",
    class_title: "Television Field Production Workshop 3 units"
  },
  {
    class_number: "2941",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Munoz M E",
    class_name: "MEDIA 88A",
    class_title: "Independent Studies in Media Studies 1 unit"
  },
  {
    class_number: "2942",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Munoz M E",
    class_name: "MEDIA 88B",
    class_title: "Independent Studies in Media Studies 2 units"
  },
  {
    class_number: "2944",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Munoz M E",
    class_name: "MEDIA 90B",
    class_title: "Internship in Media Studies 2 units"
  },
  {
    class_number: "9787",
    class_time: "3 p.m.  -  4:50 p.m. Th",
    class_location: "EC 1227 107",
    class_instructor: "Peterson J D",
    class_name: "HUMDEV E17",
    class_title: "Senior Seminar - Luisa R.G. Kot Concert Series"
  },
  {
    class_number: "9796",
    class_time: "6:30 p.m.  -  9:20 p.m. T",
    class_location: " LINCOLN",
    class_instructor: "Miyoshi Y",
    class_name: "MUSIC E00",
    class_title: "Concert Band"
  },
  {
    class_number: "9797",
    class_time: "9:30 a.m. - 11 a.m. MW",
    class_location: "PAC 104",
    class_instructor: "Terry Jr P W",
    class_name: "MUSIC E02",
    class_title: "Guitar for Older Adults"
  },
  {
    class_number: "9798",
    class_time: "10 a.m. - 12:50 p.m. T",
    class_location: " FST PRES",
    class_instructor: "Bryant W",
    class_name: "MUSIC E03",
    class_title: '"The Merits" - Vocal Ensemble'
  },
  {
    class_number: "9799",
    class_time: "12:30 p.m.  -  2:50 p.m. Th",
    class_location: "EC 1227 107",
    class_instructor: "Jackson L R",
    class_name: "MUSIC E04",
    class_title: "Voice Training"
  },
  {
    class_number: "9800",
    class_time: "1 p.m.  -  2:50 p.m. W",
    class_location: "PAC 107",
    class_instructor: "Bryant W",
    class_name: "MUSIC E06",
    class_title: "Gospel Community Chorus"
  },
  {
    class_number: "9801",
    class_time: "12 p.m.  -  1:50 p.m. T",
    class_location: " VP TERRY",
    class_instructor: "Perez J Z",
    class_name: "MUSIC E10",
    class_title: "Spanish Folk Singing"
  },
  {
    class_number: "9802",
    class_time: "11 a.m. - 12:50 p.m. T",
    class_location: "EC 1227 409",
    class_instructor: "Jackson L R",
    class_name: "MUSIC E30",
    class_title: "Opera Appreciation"
  },
  {
    class_number: "9803",
    class_time: "12 p.m.  -  1:50 p.m. F",
    class_location: "EC 1227 107",
    class_instructor: "Peterson J D",
    class_name: "MUSIC E32",
    class_title: "Music Appreciation"
  },
  {
    class_number: "9805",
    class_time: "9 a.m. - 11:50 a.m. Th",
    class_location: "EC 1227 107",
    class_instructor: "Jackson L R",
    class_name: "MUSIC E34",
    class_title: "Lyric Chorus"
  },
  {
    class_number: "9806",
    class_time: "11 a.m. - 12:50 p.m. S",
    class_location: "PAC 206",
    class_instructor: "Hetz M L",
    class_name: "MUSIC E51",
    class_title: "Piano and Theory"
  },
  {
    class_number: "2960",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "PAC 105",
    class_instructor: "Bergman J F",
    class_name: "MUSIC 31",
    class_title: "Music History II 3 units"
  },
  {
    class_number: "2961",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "PAC 114",
    class_instructor: "Bergman J F",
    class_name: "MUSIC 32",
    class_title: "Appreciation of Music 3 units"
  },
  {
    class_number: "2967",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "PAC 210",
    class_instructor: "Fiddmont F K",
    class_name: "MUSIC 33",
    class_title: "Jazz in American Culture 3 units"
  },
  {
    class_number: "2974",
    class_time: "12:15 p.m.  -  3:20 p.m. F",
    class_location: "PAC 116",
    class_instructor: "Zusman S P",
    class_name: "MUSIC 36",
    class_title: "History of Rock Music 3 units"
  },
  {
    class_number: "2975",
    class_time: "8 a.m.  -  9:20 a.m. T",
    class_location: "A 214",
    class_instructor: "Alviso J R",
    class_name: "MUSIC 37",
    class_title: "Music in American Culture 3 units"
  },
  {
    class_number: "2945",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "PAC 116",
    class_instructor: "Kim J",
    class_name: "MUSIC 1",
    class_title: "Fundamentals of Music 3 units"
  },
  {
    class_number: "2950",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "PAC 116",
    class_instructor: "Selvey J D",
    class_name: "MUSIC 2",
    class_title: "Musicianship 2 units"
  },
  {
    class_number: "2952",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "PAC 203",
    class_instructor: "Goodman D B",
    class_name: "MUSIC 3",
    class_title: "Musicianship 2 units"
  },
  {
    class_number: "2953",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "PAC 203",
    class_instructor: "Goodman D B",
    class_name: "MUSIC 4",
    class_title: "Musicianship 2 units"
  },
  {
    class_number: "2954",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "PAC 105",
    class_instructor: "Driscoll B S",
    class_name: "MUSIC 5",
    class_title: "Fundamentals of Musicianship 2 units"
  },
  {
    class_number: "2956",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "PAC 116",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 6",
    class_title: "Diatonic Harmony 3 units"
  },
  {
    class_number: "2958",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "PAC 203",
    class_instructor: "Goodman D B",
    class_name: "MUSIC 7",
    class_title: "Chromatic Harmony 3 units"
  },
  {
    class_number: "2959",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "PAC 203",
    class_instructor: "Goodman D B",
    class_name: "MUSIC 8",
    class_title: "Modulation and Analysis 3 units"
  },
  {
    class_number: "4334",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "PAC 107",
    class_instructor: "De Stefano J D",
    class_name: "MUSIC 42",
    class_title: "Advanced Opera Production 5 units"
  },
  {
    class_number: "2976",
    class_time: "12:45 p.m.  -  5:20 p.m. MW",
    class_location: "TH ART STUDIO",
    class_instructor: "Adair-Lynch T A",
    class_name: "MUSIC 45",
    class_title: "Musical Theatre Workshop 3 units"
  },
  {
    class_number: "2978",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "PAC 309",
    class_instructor: "De Stefano J D",
    class_name: "MUSIC 50A",
    class_title: "Elementary Voice 2 units"
  },
  {
    class_number: "2982",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "PAC 309",
    class_instructor: "De Stefano J D",
    class_name: "MUSIC 50B",
    class_title: "Intermediate Voice 2 units"
  },
  {
    class_number: "4341",
    class_time: "7 p.m. - 10:05 p.m. MTWThF",
    class_location: "TH ART MAIN STG",
    class_instructor: "Sawoski P",
    class_name: "MUSIC 52",
    class_title: "Advanced Production - Musical Theatre 5 units"
  },
  {
    class_number: "4342",
    class_time: "6:45 p.m.  -  9:50 p.m. Th",
    class_location: "PAC 107",
    class_instructor: "Preponis A",
    class_name: "MUSIC 53",
    class_title: "Jazz Vocal Ensemble 2 units"
  },
  {
    class_number: "4343",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "PAC 107",
    class_instructor: "Selvey J D",
    class_name: "MUSIC 55",
    class_title: "Concert Chorale 2 units"
  },
  {
    class_number: "4344",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "PAC 115",
    class_instructor: "Parnell D J",
    class_name: "MUSIC 57",
    class_title: "Advanced Vocal Performance Techniques 2 units"
  },
  {
    class_number: "2983",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "PAC 107",
    class_instructor: "Selvey J D",
    class_name: "MUSIC 59",
    class_title: "Chamber Choir 2 units"
  },
  {
    class_number: "2985",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "PAC 206",
    class_instructor: "Kozlova Yu V",
    class_name: "MUSIC 60A",
    class_title: "Elementary Piano, First Level 2 units"
  },
  {
    class_number: "2992",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "PAC 206",
    class_instructor: "Chou L",
    class_name: "MUSIC 60B",
    class_title: "Elementary Piano, Second Level 2 units"
  },
  {
    class_number: "2994",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "PAC 310",
    class_instructor: "Kozlova Yu V",
    class_name: "MUSIC 60C",
    class_title: "Elementary Piano, Third Level 2 units"
  },
  {
    class_number: "2995",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "PAC 206",
    class_instructor: "Chou L",
    class_name: "MUSIC 60D",
    class_title: "Elementary Piano, Fourth Level 2 units"
  },
  {
    class_number: "2996",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "PAC 206",
    class_instructor: "Chou L",
    class_name: "MUSIC 61B",
    class_title: "Intermediate Piano, Sixth Level 2 units"
  },
  {
    class_number: "2998",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "PAC 310",
    class_instructor: "Kozlova Yu V",
    class_name: "MUSIC 64",
    class_title: "Piano Ensemble 2 units"
  },
  {
    class_number: "4348",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "PAC 310",
    class_instructor: "Aguiar J A",
    class_name: "MUSIC 65B",
    class_title: "Keyboard Improvisation II 2 units"
  },
  {
    class_number: "2999",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "PAC 206",
    class_instructor: "Takesue S A",
    class_name: "MUSIC 66",
    class_title: "Fundamentals of Music and Elementary Piano 5 units"
  },
  {
    class_number: "3000",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "PAC 110",
    class_instructor: "Sanderson A",
    class_name: "MUSIC 70A",
    class_title: "String Instrument Techniques 2 units"
  },
  {
    class_number: "3001",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "PAC 110",
    class_instructor: "Sanderson A",
    class_name: "MUSIC 70B",
    class_title: "Intermediate Strings Techniques 2 units"
  },
  {
    class_number: "3002",
    class_time: "9 a.m. - 12:05 p.m. F",
    class_location: "PAC 110",
    class_instructor: "Smith Me M",
    class_name: "MUSIC 73A",
    class_title: "Percussion Ensemble Instrument Techniques 2 units"
  },
  {
    class_number: "3003",
    class_time: "9 a.m. - 12:05 p.m. F",
    class_location: "PAC 110",
    class_instructor: "Smith Me M",
    class_name: "MUSIC 73B",
    class_title: "Intermediate Percussion Ensemble 2 units"
  },
  {
    class_number: "4349",
    class_time: "6:45 p.m.  -  9:50 p.m. T",
    class_location: "PAC 110",
    class_instructor: "Stoyanovich E J",
    class_name: "MUSIC 74",
    class_title: "Orchestra 2 units"
  },
  {
    class_number: "4350",
    class_time: "6:45 p.m.  -  9:45 p.m. W",
    class_location: "PAC 110",
    class_instructor: "Mc Keown K O",
    class_name: "MUSIC 77",
    class_title: "Wind Ensemble 2 units"
  },
  {
    class_number: "3523",
    class_time: "2:15 p.m.  -  3:05 p.m. MTWThF",
    class_location: " PALISDS",
    class_instructor: "Stoyanovich E J",
    class_name: "MUSIC 78",
    class_title: "Jazz Ensemble 2 units"
  },
  {
    class_number: "3005",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "PAC 104",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 84A",
    class_title: "Popular Guitar, First Level 2 units"
  },
  {
    class_number: "4353",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "PAC 104",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 84B",
    class_title: "Popular Guitar, Second Level 2 units"
  },
  {
    class_number: "4355",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "PAC 104",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 84C",
    class_title: "Popular Guitar, Third Level 2 units"
  },
  {
    class_number: "4357",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "PAC 104",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 87A",
    class_title: "Classical and Flamenco Guitar, First Level 2 units"
  },
  {
    class_number: "4358",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "PAC 104",
    class_instructor: "Cheesman J M",
    class_name: "MUSIC 87B",
    class_title: "Classical and Flamenco Guitar, Second Level 2 units"
  },
  {
    class_number: "3007",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Driscoll B S",
    class_name: "MUSIC 88A",
    class_title: "Independent Studies in Music 1 unit"
  },
  {
    class_number: "3008",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Driscoll B S",
    class_name: "MUSIC 88B",
    class_title: "Independent Studies in Music 2 units"
  },
  {
    class_number: "3009",
    class_time: "Arrange - TIME ",
    class_location: " ",
    class_instructor: "Driscoll B S",
    class_name: "MUSIC 92",
    class_title: "Applied Music Instruction 2 units"
  },
  {
    class_number: "3010",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "PAC 107",
    class_instructor: "Driscoll B S",
    class_name: "MUSIC 94",
    class_title: "Concert Music Class 1 unit"
  },
  {
    class_number: "3012",
    class_time: "8 a.m. - 10:05 a.m. MT",
    class_location: "BUNDY 335",
    class_instructor: "Angel V M",
    class_name: "NURSNG 1",
    class_title: "Fundamentals of Nursing Concepts 1 2 units"
  },
  {
    class_number: "3013",
    class_time: "6:45 a.m.  -  1:15 p.m. WTh",
    class_location: "BUNDY 329",
    class_instructor: "Smith D L",
    class_name: "NURSNG 1L",
    class_title: "Fundamentals of Nursing Concepts 1 Lab 2.5 units"
  },
  {
    class_number: "3017",
    class_time: "9:30 a.m. - 11:55 a.m. MT",
    class_location: "BUNDY 335",
    class_instructor: "Khoja A M",
    class_name: "NURSNG 2",
    class_title: "Fundamentals of Nursing Concepts 2 2.5 units"
  },
  {
    class_number: "3018",
    class_time: "6:45 a.m.  -  1:15 p.m. WTh",
    class_location: " HOSP",
    class_instructor: "Khoja A M",
    class_name: "NURSNG 2L",
    class_title: "Fundamentals of Nursing Concepts 2 Lab 2.5 units"
  },
  {
    class_number: "3486",
    class_time: "10 a.m. - 12:25 p.m. MF",
    class_location: "BUNDY 416",
    class_instructor: "Williams E J",
    class_name: "NURSNG 3",
    class_title: "Adult Health Nursing Concepts 1 2.5 units"
  },
  {
    class_number: "3487",
    class_time: "7 a.m. - 11:15 a.m. TW",
    class_location: " HOSP",
    class_instructor: "Staff",
    class_name: "NURSNG 3L",
    class_title: "Adult Health Nursing Concepts 1 Lab 2.5 units"
  },
  {
    class_number: "3492",
    class_time: "1 p.m.  -  4:05 p.m. M",
    class_location: "BUNDY 335",
    class_instructor: "Banks C A",
    class_name: "NURSNG 4",
    class_title: "Mental Health Nursing Concepts 1.5 units"
  },
  {
    class_number: "3493",
    class_time: "7 a.m. - 11:05 a.m. T",
    class_location: " HOSP",
    class_instructor: "Staff",
    class_name: "NURSNG 4L",
    class_title: "Mental Health Concepts Lab 1.5 units"
  },
  {
    class_number: "3497",
    class_time: "1 p.m.  -  3:25 p.m. TF",
    class_location: "BUNDY 239",
    class_instructor: "Short A D",
    class_name: "NURSNG 5",
    class_title: "Adult Health Nursing Concepts 2 2.5 units"
  },
  {
    class_number: "3498",
    class_time: "6:30 a.m. - 10:30 a.m. MW",
    class_location: " HOSP",
    class_instructor: "Diaz C Y",
    class_name: "NURSNG 5L",
    class_title: "Adult Health Nursing Concepts 2 Lab 2.5 units"
  },
  {
    class_number: "3477",
    class_time: "7:30 a.m. - 10:45 a.m. M",
    class_location: "BUNDY 240",
    class_instructor: "Valcin-Lewis F",
    class_name: "NURSNG 6",
    class_title: "Maternal Newborn Nursing Concepts 1.5 units"
  },
  {
    class_number: "3479",
    class_time: "6:45 a.m.  -  1:15 p.m. TTh",
    class_location: " HOSP",
    class_instructor: "Smith D L",
    class_name: "NURSNG 6L",
    class_title: "Maternal Newborn Nursing Concepts Lab 1 unit"
  },
  {
    class_number: "3503",
    class_time: "2 p.m.  -  5:15 p.m. Th",
    class_location: "BUNDY 335",
    class_instructor: "Curtis D F",
    class_name: "NURSNG 7",
    class_title: "Pediatric Nursing Concepts 1.5 units"
  },
  {
    class_number: "3505",
    class_time: "8 a.m.  -  2:30 p.m. WF",
    class_location: " HOSP",
    class_instructor: "Staff",
    class_name: "NURSNG 7L",
    class_title: "Pediatric Nursing Concepts Lab 1 unit"
  },
  {
    class_number: "3023",
    class_time: "3:15 p.m.  -  6:20 p.m. M",
    class_location: "BUNDY 239",
    class_instructor: "Friedman M H",
    class_name: "NURSNG 17",
    class_title: "Pharmacological Aspects of Nursing 3 units"
  },
  {
    class_number: "3050",
    class_time: "4 p.m.  -  6:05 p.m. W",
    class_location: "BUNDY 235",
    class_instructor: "Short A D",
    class_name: "NURSNG 36",
    class_title: "Calculations in Drugs and Solutions 1 unit"
  },
  {
    class_number: "3052",
    class_time: "10 a.m. - 12:30 p.m. Th",
    class_location: "BUNDY 321",
    class_instructor: "Curtis D F",
    class_name: "NURSNG 40",
    class_title: "Nursing of Children 1.5 units"
  },
  {
    class_number: "3054",
    class_time: "7 a.m. - 11:05 a.m. WF",
    class_location: " HOSP",
    class_instructor: "Estrella D J",
    class_name: "NURSNG 40L",
    class_title: "Nursing of Children Lab 1.5 units"
  },
  {
    class_number: "3058",
    class_time: "7:30 a.m. - 10 a.m. F",
    class_location: "BUNDY 335",
    class_instructor: "Valcin-Lewis F",
    class_name: "NURSNG 45",
    class_title: "Women's Health Care 1.5 units"
  },
  {
    class_number: "3060",
    class_time: "7 a.m. - 11 a.m. MW",
    class_location: " HOSP",
    class_instructor: "Valcin-Lewis F",
    class_name: "NURSNG 45L",
    class_title: "Women's Health Care Lab 1.5 units"
  },
  {
    class_number: "3064",
    class_time: "9 a.m. - 11:45 a.m. M",
    class_location: "BUNDY 415",
    class_instructor: "Williams E J",
    class_name: "NURSNG 50",
    class_title: "Professional Role Transition 1 unit"
  },
  {
    class_number: "3065",
    class_time: "1 p.m.  -  2:25 p.m. M",
    class_location: "BUNDY 440",
    class_instructor: "Williams E J",
    class_name: "NURSNG 50L",
    class_title: "Professional Role Transition Lab 2 units"
  },
  {
    class_number: "7043",
    class_time: "10:30 a.m. - 12:30 p.m. T",
    class_location: "BUNDY 329",
    class_instructor: "Godawa K S",
    class_name: "NURSNG 900",
    class_title: "Supervised Tutoring 0 units"
  },
  {
    class_number: "3086",
    class_time: "Arrange - 7.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Maschler K J",
    class_name: "OFTECH 1",
    class_title: "Keyboarding I 3 units"
  },
  {
    class_number: "3087",
    class_time: "9:30 a.m. - 10:20 a.m. TTh",
    class_location: "BUS 253",
    class_instructor: "Reed A M",
    class_name: "OFTECH 1A",
    class_title: "Keyboarding 1A 1 unit"
  },
  {
    class_number: "3090",
    class_time: "9:30 a.m. - 10:20 a.m. TTh",
    class_location: "BUS 253",
    class_instructor: "Reed A M",
    class_name: "OFTECH 1B",
    class_title: "Keyboarding 1B 1 unit"
  },
  {
    class_number: "3093",
    class_time: "9:30 a.m. - 10:20 a.m. TTh",
    class_location: "BUS 253",
    class_instructor: "Reed A M",
    class_name: "OFTECH 1C",
    class_title: "Keyboarding 1C 1 unit"
  },
  {
    class_number: "3096",
    class_time: "9:30 a.m. - 10:20 a.m. TTh",
    class_location: "BUS 253",
    class_instructor: "Reed A M",
    class_name: "OFTECH 9",
    class_title: "Keyboarding Improvement 1 unit"
  },
  {
    class_number: "3099",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reed A M",
    class_name: "OFTECH 20",
    class_title: "Medical Vocabulary 3 units"
  },
  {
    class_number: "3100",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reed A M",
    class_name: "OFTECH 24",
    class_title: "Medical Coding/Billing 1 3 units"
  },
  {
    class_number: "3101",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reed A M",
    class_name: "OFTECH 25",
    class_title: "Medical Coding/Billing 2 3 units"
  },
  {
    class_number: "3102",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reed A M",
    class_name: "OFTECH 30",
    class_title: "Legal Office Procedures 3 units"
  },
  {
    class_number: "3103",
    class_time: "Arrange - 4.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Reed A M",
    class_name: "OFTECH 31",
    class_title: "Legal Terms and Transcription 3 units"
  },
  {
    class_number: "3104",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "MC 16",
    class_instructor: "Pourzangi B",
    class_name: "PERSIN 2",
    class_title: "Elementary Persian II 5 units"
  },
  {
    class_number: "3106",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 151",
    class_instructor: "Huffaker P",
    class_name: "PHILOS 1",
    class_title: "Knowledge and Reality 3 units"
  },
  {
    class_number: "3116",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 154",
    class_instructor: "Klumpe P A",
    class_name: "PHILOS 2",
    class_title: "Ethics 3 units"
  },
  {
    class_number: "3119",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 150",
    class_instructor: "Mohsen A M",
    class_name: "PHILOS 3",
    class_title: "Early Philosophers 3 units"
  },
  {
    class_number: "3121",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 252",
    class_instructor: "Daily M S",
    class_name: "PHILOS 4",
    class_title: "Modern Philosophers 3 units"
  },
  {
    class_number: "3122",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 153",
    class_instructor: "Kaufman S M",
    class_name: "PHILOS 5",
    class_title: "Contemporary Moral Conflicts 3 units"
  },
  {
    class_number: "3123",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 150",
    class_instructor: "Mohsen A M",
    class_name: "PHILOS 7",
    class_title: "Logic and Critical Thinking 3 units"
  },
  {
    class_number: "3129",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 152",
    class_instructor: "Klumpe P A",
    class_name: "PHILOS 9",
    class_title: "Symbolic Logic 3 units"
  },
  {
    class_number: "3131",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "HSS 205",
    class_instructor: "Kaufman S M",
    class_name: "PHILOS 11",
    class_title: "Philosophy of Art and Aesthetics 3 units"
  },
  {
    class_number: "3132",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "HSS 104",
    class_instructor: "Huffaker P",
    class_name: "PHILOS 20",
    class_title: "Environmental Ethics 3 units"
  },
  {
    class_number: "3133",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 263",
    class_instructor: "Quesada D M",
    class_name: "PHILOS 22",
    class_title: "Asian Philosophy 3 units"
  },
  {
    class_number: "3134",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Bennet S E",
    class_name: "PHILOS 23",
    class_title: "Philosophy of Religion 3 units"
  },
  {
    class_number: "3136",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 154",
    class_instructor: "Oifer E R",
    class_name: "PHILOS 51",
    class_title: "Political Philosophy 3 units"
  },
  {
    class_number: "4361",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "HSS 151",
    class_instructor: "Kurvink S J",
    class_name: "PHILOS 52",
    class_title: "Contemporary Political Thought 3 units"
  },
  {
    class_number: "3139",
    class_time: "Arrange  -  1 Hour ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "PHILOS 88A",
    class_title: "Independent Studies in Philosophy 1 unit"
  },
  {
    class_number: "3140",
    class_time: "Arrange  -  2 Hours ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "PHILOS 88B",
    class_title: "Independent Studies in Philosophy 2 units"
  },
  {
    class_number: "3141",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 204",
    class_instructor: "Nelson H",
    class_name: "PHOTO 1",
    class_title: "Introduction to Photography 3 units"
  },
  {
    class_number: "3155",
    class_time: "10 a.m.  -  1 p.m. F",
    class_location: "DRSCHR 127",
    class_instructor: "Fier B",
    class_name: "PHOTO 2",
    class_title: "Basic Black and White Darkroom Techniques 2 units"
  },
  {
    class_number: "3158",
    class_time: "9:30 a.m. - 12:35 p.m. T",
    class_location: "BUS 131",
    class_instructor: "Nelson H",
    class_name: "PHOTO 5",
    class_title: "Digital Asset Management, Modification and Output 3 units"
  },
  {
    class_number: "3162",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "CMD 128",
    class_instructor: "Burkhart G J",
    class_name: "PHOTO 13",
    class_title: "News Photography 3 units"
  },
  {
    class_number: "3163",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "CMD 131",
    class_instructor: "Burkhart G J",
    class_name: "PHOTO 14",
    class_title: "Photography for Publication 3 units"
  },
  {
    class_number: "3164",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "DRSCHR 110G",
    class_instructor: "Mohr C D",
    class_name: "PHOTO 30",
    class_title: "Techniques of Artificial Lighting 4 units"
  },
  {
    class_number: "4366",
    class_time: "6 p.m.  -  9 p.m. T",
    class_location: "BUS 133",
    class_instructor: "Sanseri J D",
    class_name: "PHOTO 32",
    class_title: "Lighting for People 2 4 units"
  },
  {
    class_number: "3165",
    class_time: "2:15 p.m.  -  5:20 p.m. T",
    class_location: "BUS 133",
    class_instructor: "Mohr C D",
    class_name: "PHOTO 33",
    class_title: "Lighting for Products 4 units"
  },
  {
    class_number: "3166",
    class_time: "2 p.m.  -  5 p.m. T",
    class_location: "DRSCHR 110",
    class_instructor: "Withers J J",
    class_name: "PHOTO 34",
    class_title: "Capture to Composite 4 units"
  },
  {
    class_number: "4367",
    class_time: "5 p.m.  -  8 p.m. W",
    class_location: "DRSCHR 127",
    class_instructor: "Moulton S A",
    class_name: "PHOTO 37",
    class_title: "Advanced Black and White Printing Techniques 3 units"
  },
  {
    class_number: "3167",
    class_time: "Arrange - 10 Hours ",
    class_location: " ONLINE",
    class_instructor: "Calzatti N",
    class_name: "PHOTO 39",
    class_title: "Beginning Photoshop 3 units"
  },
  {
    class_number: "4369",
    class_time: "6 p.m.  -  9 p.m. T",
    class_location: "BUS 131",
    class_instructor: "Withers J J",
    class_name: "PHOTO 42",
    class_title: "Advanced Photoshop 3 units"
  },
  {
    class_number: "4370",
    class_time: "6:45 p.m.  -  9:50 p.m. Th",
    class_location: "BUS 133",
    class_instructor: "Nex A J",
    class_name: "PHOTO 43",
    class_title: "Portfolio Development 3 units"
  },
  {
    class_number: "4371",
    class_time: "5 p.m.  -  8 p.m. F",
    class_location: "DRSCHR 126",
    class_instructor: "Mcdonald S D",
    class_name: "PHOTO 50",
    class_title: "Basic Color Printing 3 units"
  },
  {
    class_number: "3168",
    class_time: "3:45 p.m.  -  5:05 p.m. TTh",
    class_location: "A 214",
    class_instructor: "Dastin E R",
    class_name: "PHOTO 52",
    class_title: "History of Photography 3 units"
  },
  {
    class_number: "3170",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Anderson Da",
    class_name: "PHOTO 60",
    class_title: "Business Practices in Photography 3 units"
  },
  {
    class_number: "3171",
    class_time: "2 p.m.  -  5 p.m. T",
    class_location: "DRSCHR 127",
    class_instructor: "Sanseri J D",
    class_name: "PHOTO 64",
    class_title: "Community Documentary Photography 4 units"
  },
  {
    class_number: "3172",
    class_time: "Arrange  -  1 Hour ",
    class_location: "BUS 120",
    class_instructor: "Sanseri J D",
    class_name: "PHOTO 88A",
    class_title: "Independent Studies in Photography 1 unit"
  },
  {
    class_number: "4373",
    class_time: "Arrange - TIME  N ",
    class_location: " ",
    class_instructor: "Sanseri J D",
    class_name: "PHOTO 88B",
    class_title: "Independent Studies in Photography 2 units"
  },
  {
    class_number: "3174",
    class_time: "Arrange  -  4 Hours ",
    class_location: "BUS 120C",
    class_instructor: "Withers J J",
    class_name: "PHOTO 90A",
    class_title: "Photography Internship 1 unit"
  },
  {
    class_number: "3175",
    class_time: "Arrange  -  8 Hours ",
    class_location: "BUS 120C",
    class_instructor: "Withers J J",
    class_name: "PHOTO 90B",
    class_title: "Internship in Photography 2 units"
  },
  {
    class_number: "3176",
    class_time: "Arrange - 12 Hours ",
    class_location: "BUS 120C",
    class_instructor: "Withers J J",
    class_name: "PHOTO 90C",
    class_title: "Internship in Photography 3 units"
  },
  {
    class_number: "4406",
    class_time: "6:30 p.m.  -  9:15 p.m. MW",
    class_location: "AIR 101",
    class_instructor: "Cooley S",
    class_name: "PV 11",
    class_title: "Introduction to Solar Photovoltaics 3 units"
  },
  {
    class_number: "4407",
    class_time: "6:30 p.m.  -  8:35 p.m. MW",
    class_location: "AIR 101",
    class_instructor: "Cooley S",
    class_name: "PV 12",
    class_title: "Photovoltaic Installation Exam Preparation 2 units"
  },
  {
    class_number: "3185",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "SCI 155",
    class_instructor: "Paik S T",
    class_name: "PHYSCS 6",
    class_title: "General Physics 1 with Lab 4 units"
  },
  {
    class_number: "3187",
    class_time: "12:45 p.m.  -  3:50 p.m. TTh",
    class_location: "SCI 122",
    class_instructor: "Paik S T",
    class_name: "PHYSCS 7",
    class_title: "General Physics 2 with Lab 4 units"
  },
  {
    class_number: "3188",
    class_time: "7:45 a.m.  -  9:45 a.m. MW",
    class_location: "SCI 157",
    class_instructor: "Henderson J M",
    class_name: "PHYSCS 8",
    class_title: "Calculus-based General Physics 1 with Lab 4 units"
  },
  {
    class_number: "3190",
    class_time: "2:45 p.m.  -  6:15 p.m. MW",
    class_location: "SCI 122",
    class_instructor: "Kaluza M",
    class_name: "PHYSCS 9",
    class_title: "Calculus-based General Physics 2 with Lab 4 units"
  },
  {
    class_number: "3191",
    class_time: "10:40 a.m. - 12 p.m. MW",
    class_location: "SCI 101",
    class_instructor: "Kamaga C N",
    class_name: "PHYSCS 12",
    class_title: "Introductory Physics Non-Lab 3 units"
  },
  {
    class_number: "3192",
    class_time: "2:15 p.m.  -  4:15 p.m. MW",
    class_location: "SCI 106",
    class_instructor: "Lucas E",
    class_name: "PHYSCS 14",
    class_title: "Introductory Physics with Lab 4 units"
  },
  {
    class_number: "3194",
    class_time: "3:45 p.m.  -  6:40 p.m. TTh",
    class_location: "SCI 106",
    class_instructor: "Arabi M",
    class_name: "PHYSCS 20",
    class_title: "Preparation for Calculus-Based Physics 2 units"
  },
  {
    class_number: "3195",
    class_time: "8 a.m. - 10:35 a.m. MW",
    class_location: "SCI 101",
    class_instructor: "Menachekanian E",
    class_name: "PHYSCS 21",
    class_title: "Mechanics with Lab 5 units"
  },
  {
    class_number: "3201",
    class_time: "9 a.m. - 11:15 a.m. TTh",
    class_location: "SCI 122",
    class_instructor: "Strohmaier K D",
    class_name: "PHYSCS 22",
    class_title: "Electricity and Magnetism with Lab 5 units"
  },
  {
    class_number: "3204",
    class_time: "8:45 a.m. - 11 a.m. TTh",
    class_location: "SCI 106",
    class_instructor: "Faridian F",
    class_name: "PHYSCS 23",
    class_title: "Fluids, Waves, Thermodynamics, Optics with Lab 5 units"
  },
  {
    class_number: "4384",
    class_time: "6:30 p.m.  -  9 p.m. MW",
    class_location: "SCI 140",
    class_instructor: "Morse P A",
    class_name: "PHYSCS 24",
    class_title: "Modern Physics with Lab 3 units"
  },
  {
    class_number: "3206",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 165",
    class_instructor: "Tahvildaranjess R A",
    class_name: "POL SC 1",
    class_title: "National and California Government 3 units"
  },
  {
    class_number: "3222",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 151",
    class_instructor: "Gabler C L",
    class_name: "POL SC 2",
    class_title: "Comparative Government and Politics 3 units"
  },
  {
    class_number: "3228",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 263",
    class_instructor: "Rabach E R",
    class_name: "POL SC 5",
    class_title:
      "International Political Economy: Introduction to Global Studies 3 units"
  },
  {
    class_number: "3230",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "HSS 263",
    class_instructor: "Monteiro N",
    class_name: "POL SC 7",
    class_title: "International Politics 3 units"
  },
  {
    class_number: "3235",
    class_time: "Arrange - 12 Hours ",
    class_location: "HSS 357",
    class_instructor: "Buckley A D",
    class_name: "POL SC 10",
    class_title: "Government Internships 3 units"
  },
  {
    class_number: "3236",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 151",
    class_instructor: "Rivas Pineda Y G",
    class_name: "POL SC 21",
    class_title: "Race, Ethnicity, and the Politics of Difference 3 units"
  },
  {
    class_number: "3237",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 151",
    class_instructor: "Gabler C L",
    class_name: "POL SC 24",
    class_title: "Introduction to Law 3 units"
  },
  {
    class_number: "3238",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "MC 14",
    class_instructor: "Davis Sh L",
    class_name: "POL SC 31",
    class_title: "Introduction to Public Policy 3 units"
  },
  {
    class_number: "3241",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 154",
    class_instructor: "Oifer E R",
    class_name: "POL SC 51",
    class_title: "Political Philosophy 3 units"
  },
  {
    class_number: "4388",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "HSS 151",
    class_instructor: "Kurvink S J",
    class_name: "POL SC 52",
    class_title: "Contemporary Political Thought 3 units"
  },
  {
    class_number: "3244",
    class_time: "Arrange  -  1 Hour ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "POL SC 88A",
    class_title: "Independent Studies in Political Science 1 unit"
  },
  {
    class_number: "3245",
    class_time: "Arrange  -  2 Hours ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "POL SC 88B",
    class_title: "Independent Studies in Political Science 2 units"
  },
  {
    class_number: "3246",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Gabler C L",
    class_name: "POL SC 94",
    class_title: "Law - Experiential Learning 0.5 units"
  },
  {
    class_number: "3248",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Tahvildaranjess R A",
    class_name: "POL SC 95",
    class_title: "Public Policy - Experiential Learning 1 units"
  },
  {
    class_number: "9821",
    class_time: "10 a.m. - 11:50 a.m. M",
    class_location: " SM LIB",
    class_instructor: "Reiner M",
    class_name: "POL SC E00",
    class_title: "Current Events"
  },
  {
    class_number: "3250",
    class_time: "2:15 p.m.  -  5:20 p.m. W",
    class_location: "CPC 104",
    class_instructor: "Benditson A",
    class_name: "PRO CR 7",
    class_title: "Coaching of Soccer 3 units"
  },
  {
    class_number: "3251",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 205",
    class_instructor: "Thomas J L",
    class_name: "PRO CR 10",
    class_title: "Introduction to Kinesiology 3 units"
  },
  {
    class_number: "4389",
    class_time: "5:15 p.m.  -  8:20 p.m. M",
    class_location: "CPC 104",
    class_instructor: "Bertell M",
    class_name: "PRO CR 11",
    class_title: "Introduction to Sports Injuries 3 units"
  },
  {
    class_number: "3254",
    class_time: "8 a.m. - 12:05 p.m. F",
    class_location: "CPC 104",
    class_instructor: "Shima T H",
    class_name: "PRO CR 12",
    class_title: "Emergency Care and Water Safety 3 units"
  },
  {
    class_number: "3255",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Thomas J L",
    class_name: "PRO CR 19",
    class_title: "Field Experience 2 units"
  },
  {
    class_number: "3256",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "CPC 104",
    class_instructor: "Metzler K A",
    class_name: "PRO CR 25",
    class_title: "Personal Trainer Preparation 3 units"
  },
  {
    class_number: "3257",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "MC 8",
    class_instructor: "Maidenberg J D",
    class_name: "PRO CR 80",
    class_title: "Athletes and Leadership 3 units"
  },
  {
    class_number: "3258",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 254",
    class_instructor: "Schwartz A F",
    class_name: "PSYCH 1",
    class_title: "General Psychology 3 units"
  },
  {
    class_number: "3286",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 255",
    class_instructor: "Shirinyan D",
    class_name: "PSYCH 2",
    class_title: "Physiological Psychology 3 units"
  },
  {
    class_number: "3295",
    class_time: "Arrange - 6.5 Hours ",
    class_location: " ONLINE",
    class_instructor: "Chin D",
    class_name: "PSYCH 3",
    class_title: "Personality: Dynamics and Development 3 units"
  },
  {
    class_number: "3297",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 253",
    class_instructor: "Chopp R M",
    class_name: "PSYCH 5",
    class_title: "The Psychology of Communication 3 units"
  },
  {
    class_number: "3298",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 255",
    class_instructor: "Guild L A",
    class_name: "PSYCH 6",
    class_title: "Marriage, Family, and Human Intimacy 3 units"
  },
  {
    class_number: "3299",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 256",
    class_instructor: "Hald L A",
    class_name: "PSYCH 7",
    class_title: "Research Methods in Psychology 3 units"
  },
  {
    class_number: "3301",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "BUNDY 217",
    class_instructor: "Matheson C C",
    class_name: "PSYCH 11",
    class_title: "Child Growth and Development 3 units"
  },
  {
    class_number: "4401",
    class_time: "6:45 p.m.  -  9:50 p.m. M",
    class_location: "HSS 254",
    class_instructor: "Farwell L A",
    class_name: "PSYCH 13",
    class_title: "Social Psychology 3 units"
  },
  {
    class_number: "3312",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "HSS 255",
    class_instructor: "O'Leary B A",
    class_name: "PSYCH 14",
    class_title: "Abnormal Psychology 3 units"
  },
  {
    class_number: "3314",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "BUS 101",
    class_instructor: "Woodard N L",
    class_name: "PSYCH 19",
    class_title: "Lifespan Human Development 3 units"
  },
  {
    class_number: "3318",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 106",
    class_instructor: "Anderson St M",
    class_name: "PSYCH 25",
    class_title: "Human Sexuality 3 units"
  },
  {
    class_number: "3321",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "HSS 253",
    class_instructor: "Schwartz A F",
    class_name: "PSYCH 40",
    class_title: "Environmental Psychology 3 units"
  },
  {
    class_number: "3579",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Schwartz A F",
    class_name: "PSYCH 88B",
    class_title: "Independent Studies in Psychology 2 units"
  },
  {
    class_number: "3327",
    class_time: "3 p.m.  -  6:05 p.m. TTh",
    class_location: "HSS 156",
    class_instructor: "Charles V H",
    class_name: "RRM 1",
    class_title: "Introduction to Recycling Resource Management 3 units"
  },
  {
    class_number: "4409",
    class_time: "6:30 p.m.  -  9:35 p.m. TTh",
    class_location: "HSS 156",
    class_instructor: "Charles V H",
    class_name: "RRM 2",
    class_title: "Culture and Zero Waste 3 units"
  },
  {
    class_number: "3328",
    class_time: "3 p.m.  -  6:05 p.m. TTh",
    class_location: "HSS 156",
    class_instructor: "Huls J M",
    class_name: "RRM 3",
    class_title: "Resource Management and Zero Waste for Communities 3 units"
  },
  {
    class_number: "4410",
    class_time: "6:30 p.m.  -  9:35 p.m. TTh",
    class_location: "HSS 154",
    class_instructor: "Sasu S",
    class_name: "RRM 4",
    class_title: "Resource Management and Zero Waste in Business 3 units"
  },
  {
    class_number: "4408",
    class_time: "6:45 p.m.  -  9:50 p.m. W",
    class_location: "DRSCHR 212",
    class_instructor: "Remmes J",
    class_name: "REL ST 51",
    class_title: "Literature of the Bible: Old Testament 3 units"
  },
  {
    class_number: "3322",
    class_time: "3:45 p.m.  -  5:05 p.m. T",
    class_location: "DRSCHR 212",
    class_instructor: "Del George D K",
    class_name: "REL ST 52",
    class_title: "Literature of the Bible: New Testament 3 units"
  },
  {
    class_number: "3323",
    class_time: "6:15 p.m.  -  8:20 p.m. T",
    class_location: "BUNDY 416",
    class_instructor: "Santana S A",
    class_name: "RES TH 1",
    class_title: "Introduction to Respiratory Therapy 2 units"
  },
  {
    class_number: "3324",
    class_time: "8:30 a.m. - 12:30 p.m. W",
    class_location: "BUNDY 240",
    class_instructor: "Santana S A",
    class_name: "RES TH 29",
    class_title: "Neonatal and Pediatric Respiratory Therapy 4 units"
  },
  {
    class_number: "3325",
    class_time: "8 a.m. - 11 a.m. T",
    class_location: "BUNDY 239",
    class_instructor: "Welch M A",
    class_name: "RES TH 30",
    class_title: "Adult Critical Care Monitory and Diagnostics 3 units"
  },
  {
    class_number: "3326",
    class_time: "8 a.m. - 11:05 a.m. M",
    class_location: "BUNDY 414",
    class_instructor: "Santana S A",
    class_name: "RES TH 70",
    class_title: "Respiratory Pathophysiology 4 units"
  },
  {
    class_number: "4411",
    class_time: "7:30 p.m.  -  9:55 p.m. MW",
    class_location: "HSS 154",
    class_instructor: "Bauckus S J",
    class_name: "RUSS 2",
    class_title: "Elementary Russian II 5 units"
  },
  {
    class_number: "3330",
    class_time: "9:30 a.m. - 10:35 a.m. F",
    class_location: "SCI 151",
    class_instructor: "Collins L E",
    class_name: "SCI 10",
    class_title: "Principles and Practice of Scientific Research 2 units"
  },
  {
    class_number: "3332",
    class_time: "8 a.m.  -  9:20 a.m. MW",
    class_location: "HSS 152",
    class_instructor: "Romo R",
    class_name: "SOCIOL 1",
    class_title: "Introduction to Sociology 3 units"
  },
  {
    class_number: "3354",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "HSS 150",
    class_instructor: "Berry N",
    class_name: "SOCIOL 2",
    class_title: "Social Problems 3 units"
  },
  {
    class_number: "3356",
    class_time: "2:15 p.m.  -  3:35 p.m. TTh",
    class_location: "HSS 152",
    class_instructor: "Thing J P",
    class_name: "SOCIOL 4",
    class_title: "Sociological Analysis 3 units"
  },
  {
    class_number: "3358",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 205",
    class_instructor: "Crawford A",
    class_name: "SOCIOL 30",
    class_title: "African Americans in Contemporary Society 3 units"
  },
  {
    class_number: "3359",
    class_time: "12:45 p.m.  -  2:05 p.m. MW",
    class_location: "HSS 154",
    class_instructor: "Romo R",
    class_name: "SOCIOL 31",
    class_title: "Latinas/os in Contemporary Society 3 units"
  },
  {
    class_number: "3361",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "HSS 154",
    class_instructor: "Livings G S",
    class_name: "SOCIOL 33",
    class_title: "Sociology of Sex and Gender 3 units"
  },
  {
    class_number: "3363",
    class_time: "2:15 p.m.  -  3:35 p.m. MW",
    class_location: "HSS 154",
    class_instructor: "Livings G S",
    class_name: "SOCIOL 34",
    class_title: "Racial and Ethnic Relations in American Society 3 units"
  },
  {
    class_number: "3364",
    class_time: "Arrange  -  1 Hour ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "SOCIOL 88A",
    class_title: "Independent Studies in Sociology 1 unit"
  },
  {
    class_number: "3365",
    class_time: "Arrange  -  2 Hours ",
    class_location: "HSS 354",
    class_instructor: "Schultz C K",
    class_name: "SOCIOL 88B",
    class_title: "Independent Studies in Sociology 2 units"
  },
  {
    class_number: "3366",
    class_time: "7:45 a.m.  -  9:15 a.m. TThF",
    class_location: "DRSCHR 208",
    class_instructor: "Bolivar-Owen E",
    class_name: "SPAN 1",
    class_title: "Elementary Spanish I 5 units"
  },
  {
    class_number: "3371",
    class_time: "9:30 a.m. - 11:55 a.m. MW",
    class_location: "DRSCHR 217",
    class_instructor: "Trives T",
    class_name: "SPAN 2",
    class_title: "Elementary Spanish II 5 units"
  },
  {
    class_number: "3374",
    class_time: "12:45 p.m.  -  3:10 p.m. MW",
    class_location: "DRSCHR 213",
    class_instructor: "Lee Chan A",
    class_name: "SPAN 3",
    class_title: "Intermediate Spanish I 5 units"
  },
  {
    class_number: "3511",
    class_time: "2:30 p.m.  -  4:55 p.m. TTh",
    class_location: "DRSCHR 218",
    class_instructor: "Lee Chan A",
    class_name: "SPAN 4",
    class_title: "Intermediate Spanish II 5 units"
  },
  {
    class_number: "4415",
    class_time: "5 p.m.  -  7:05 p.m. MW",
    class_location: "DRSCHR 213",
    class_instructor: "Staff",
    class_name: "SPAN 8",
    class_title: "Conversational Spanish 2 units"
  },
  {
    class_number: "3375",
    class_time: "8:30 a.m. - 10:55 a.m. TTh",
    class_location: "DRSCHR 218",
    class_instructor: "Lee Chan A",
    class_name: "SPAN 11",
    class_title: "Spanish for Heritage Speakers I 5 units"
  },
  {
    class_number: "3556",
    class_time: "12:45 p.m.  -  3:10 p.m. MW",
    class_location: "BUS 133",
    class_instructor: "Lee Chan A",
    class_name: "SPAN 12",
    class_title: "Spanish for Native Speakers 2 5 units"
  },
  {
    class_number: "3377",
    class_time: "Arrange  -  3 Hours ",
    class_location: " ONLINE",
    class_instructor: "Arevalo L H",
    class_name: "SPAN 20",
    class_title: "Latin American Civilization 3 units"
  },
  {
    class_number: "3378",
    class_time: "12:45 p.m.  -  2:50 p.m. MW",
    class_location: "MC 16",
    class_instructor: "Mizuki A H",
    class_name: "SPAN 31A",
    class_title: "Practical Spanish 3 units"
  },
  {
    class_number: "9786",
    class_time: "9 a.m. - 10:50 a.m. W",
    class_location: "EC 1227 409",
    class_instructor: "Achorn J C",
    class_name: "HUMDEV E15",
    class_title: "Theater - History of Comedy"
  },
  {
    class_number: "9824",
    class_time: "11 a.m.  -  1:50 p.m. T",
    class_location: "EC 1227 107",
    class_instructor: "Gannen B",
    class_name: "TH ART E01",
    class_title: "Principles of Acting"
  },
  {
    class_number: "9826",
    class_time: "9 a.m. - 10:50 a.m. F",
    class_location: "EC 1227 107",
    class_instructor: "Abatemarco A M",
    class_name: "TH ART E02",
    class_title: "Theater Arts Appreciation"
  },
  {
    class_number: "9827",
    class_time: "11 a.m. - 12:50 p.m. F",
    class_location: "EC 1227 409",
    class_instructor: "Abatemarco A M",
    class_name: "TH ART E05",
    class_title: "Reader's Theater"
  },
  {
    class_number: "9828",
    class_time: "1:30 p.m.  -  3:45 p.m. W",
    class_location: "EC 1227 107",
    class_instructor: "Laffey S A",
    class_name: "TH ART E30",
    class_title: "Dramatic Interpretation Through Movies"
  },
  {
    class_number: "3380",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "TH ART 102",
    class_instructor: "Anderson C B",
    class_name: "TH ART 2",
    class_title: "Introduction to the Theatre 3 units"
  },
  {
    class_number: "3382",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "TH ART STUDIO",
    class_instructor: "Adair-Lynch T A",
    class_name: "TH ART 5",
    class_title: "History of World Theatre 3 units"
  },
  {
    class_number: "3384",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: "TH ART 101",
    class_instructor: "Robbins C R",
    class_name: "TH ART 10A",
    class_title: "Voice Development for the Stage 3 units"
  },
  {
    class_number: "3532",
    class_time: "1:30 p.m.  -  4:30 p.m. W",
    class_location: " CULVER",
    class_instructor: "Robbins C R",
    class_name: "TH ART 13",
    class_title: "Stage Dialects 2 units"
  },
  {
    class_number: "3385",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "TH ART 101",
    class_instructor: "Sawoski P",
    class_name: "TH ART 15",
    class_title: "Stage Movement for the Actor 1 unit"
  },
  {
    class_number: "3386",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "TH ART 101",
    class_instructor: "Sawoski P",
    class_name: "TH ART 16",
    class_title: "Advanced Stage Movement for the Actor 2 units"
  },
  {
    class_number: "3387",
    class_time: "Arrange  -  3 Hours ",
    class_location: "TH ART MAIN STG",
    class_instructor: "Anzelc L L",
    class_name: "TH ART 18A",
    class_title: "Technical Theatre Production Workshop 1 unit"
  },
  {
    class_number: "3388",
    class_time: "Arrange  -  6 Hours ",
    class_location: "TH ART MAIN STG",
    class_instructor: "Anzelc L L",
    class_name: "TH ART 18B",
    class_title: "Technical Theatre Production Workshop 2 units"
  },
  {
    class_number: "3389",
    class_time: "Arrange  -  9 Hours ",
    class_location: "TH ART MAIN STG",
    class_instructor: "Anzelc L L",
    class_name: "TH ART 18C",
    class_title: "Technical Theatre Production Workshop 3 units"
  },
  {
    class_number: "3390",
    class_time: "12:45 p.m.  -  3:10 p.m. MW",
    class_location: "TH ART MAIN STG",
    class_instructor: "Allen L A",
    class_name: "TH ART 20",
    class_title: "Stagecraft 3 units"
  },
  {
    class_number: "4417",
    class_time: "7 p.m. - 10:05 p.m. M",
    class_location: "TH ART 130",
    class_instructor: "Anzelc L L",
    class_name: "TH ART 21",
    class_title: "Scenic Painting Techniques 3 units"
  },
  {
    class_number: "3392",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: "TH ART STUDIO",
    class_instructor: "Allen L A",
    class_name: "TH ART 22",
    class_title: "Stage Lighting 3 units"
  },
  {
    class_number: "3393",
    class_time: "11:15 a.m.  -  2:20 p.m. F",
    class_location: "TH ART MAIN STG",
    class_instructor: "Allen L A",
    class_name: "TH ART 23",
    class_title: "Projection and Lighting Design 3 units"
  },
  {
    class_number: "3394",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "TH ART STUDIO",
    class_instructor: "Floyd J M",
    class_name: "TH ART 25",
    class_title: "Introduction to Theatrical Sound 3 units"
  },
  {
    class_number: "3395",
    class_time: "12:45 p.m.  -  2:50 p.m. MW",
    class_location: "TH ART 102",
    class_instructor: "Hludzik E A",
    class_name: "TH ART 26",
    class_title: "Introduction to Stage Costuming 3 units"
  },
  {
    class_number: "3396",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "TH ART 132",
    class_instructor: "Adair-Lynch T A",
    class_name: "TH ART 28A",
    class_title: "Beginning Stage Make-Up 1 unit"
  },
  {
    class_number: "3397",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "TH ART 102",
    class_instructor: "Allen L A",
    class_name: "TH ART 31",
    class_title: "Introduction to Stage Management 3 units"
  },
  {
    class_number: "3398",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "TH ART 102",
    class_instructor: "Buderwitz T E",
    class_name: "TH ART 32",
    class_title: "Scenic Design 2 units"
  },
  {
    class_number: "3399",
    class_time: "8 a.m. - 11:05 a.m. F",
    class_location: "TH ART 101",
    class_instructor: "Martin A F",
    class_name: "TH ART 41",
    class_title: "Acting I 3 units"
  },
  {
    class_number: "3402",
    class_time: "9:30 a.m. - 10:50 a.m. MW",
    class_location: "TH ART 101",
    class_instructor: "Sawoski P",
    class_name: "TH ART 42",
    class_title: "Acting II 3 units"
  },
  {
    class_number: "3404",
    class_time: "12:45 p.m.  -  5:20 p.m. MW",
    class_location: "TH ART STUDIO",
    class_instructor: "Adair-Lynch T A",
    class_name: "TH ART 45",
    class_title: "Musical Theatre Workshop 3 units"
  },
  {
    class_number: "4420",
    class_time: "7 p.m. - 10:05 p.m. W",
    class_location: "TH ART 101",
    class_instructor: "Gonzalez Jr E",
    class_name: "TH ART 46",
    class_title: "Comedy Acting Workshop 3 units"
  },
  {
    class_number: "4421",
    class_time: "7 p.m. - 10:05 p.m. MTWThF",
    class_location: "TH ART MAIN STG",
    class_instructor: "Hall B H",
    class_name: "TH ART 50",
    class_title: "Advanced Production - Full Play 3 units"
  },
  {
    class_number: "3405",
    class_time: "Arrange - 1.5 Hours ",
    class_location: "TH ART 132",
    class_instructor: "Hall B H",
    class_name: "TH ART 51",
    class_title: "Stage Make-Up Workshop 0.5 unit"
  },
  {
    class_number: "4422",
    class_time: "7 p.m. - 10:05 p.m. MTWThF",
    class_location: "TH ART MAIN STG",
    class_instructor: "Sawoski P",
    class_name: "TH ART 52",
    class_title: "Advanced Production - Musical Theatre 5 units"
  },
  {
    class_number: "3408",
    class_time: "Arrange  -  6 Hours ",
    class_location: "TH ART STUDIO",
    class_instructor: "Harrop A M",
    class_name: "TH ART 55",
    class_title: "Advanced Production - Small Theatre Venue 3 units"
  },
  {
    class_number: "3413",
    class_time: "11:15 a.m. - 12:35 p.m. MW",
    class_location: "HSS 253",
    class_instructor: "Morris P S",
    class_name: "URBAN 8",
    class_title: "Introduction to Urban Studies 3 units"
  },
  {
    class_number: "3415",
    class_time: "8 a.m.  -  9:20 a.m. TTh",
    class_location: " FIELD",
    class_instructor: "Hank M E",
    class_name: "VAR PE 11B",
    class_title: "Off-Season Intercollegiate Strength and Conditioning 1 unit"
  },
  {
    class_number: "4423",
    class_time: "5:15 p.m.  -  6:35 p.m. MTWTh",
    class_location: " FIELD",
    class_instructor: "Staff",
    class_name: "VAR PE 20V",
    class_title: "Advanced Football for Men 1 unit"
  },
  {
    class_number: "3422",
    class_time: "Arrange - 10 Hours ",
    class_location: " JA FIELD",
    class_instructor: "Druckman C J",
    class_name: "VAR PE 45W",
    class_title: "Varsity Softball for Women 3 units"
  },
  {
    class_number: "3423",
    class_time: "Arrange - 10 Hours ",
    class_location: " POOL",
    class_instructor: "Eskridge B M",
    class_name: "VAR PE 48V",
    class_title: "Varsity Swimming and Diving for Men 3 units"
  },
  {
    class_number: "3424",
    class_time: "Arrange - 10 Hours ",
    class_location: " POOL",
    class_instructor: "Eskridge B M",
    class_name: "VAR PE 48W",
    class_title: "Varsity Swimming and Diving for Women 3 units"
  },
  {
    class_number: "3425",
    class_time: "Arrange  -  3 Hours ",
    class_location: " MEMOR PK",
    class_instructor: "Goldenson R M",
    class_name: "VAR PE 54W",
    class_title: "Varsity Tennis for Women 3 units"
  },
  {
    class_number: "3426",
    class_time: "Arrange - 10 Hours ",
    class_location: " TRACK",
    class_instructor: "Silva L",
    class_name: "VAR PE 56V",
    class_title: "Varsity Track and Field for Men 3 units"
  },
  {
    class_number: "3427",
    class_time: "Arrange - 10 Hours ",
    class_location: " TRACK",
    class_instructor: "Silva L",
    class_name: "VAR PE 56W",
    class_title: "Varsity Track and Field for Women 3 units"
  },
  {
    class_number: "3428",
    class_time: "2:30 p.m.  -  4:30 p.m. MTWThF",
    class_location: "GYM 100",
    class_instructor: "Douglas T B Jr",
    class_name: "VAR PE 57V",
    class_title: "Varsity Volleyball for Men 3 units"
  },
  {
    class_number: "3429",
    class_time: "Arrange - 10 Hours ",
    class_location: " BEACH",
    class_instructor: "Owens K",
    class_name: "VAR PE 59W",
    class_title: "Varsity Beach Volleyball for Women 3 units"
  },
  {
    class_number: "3430",
    class_time: "9:30 a.m. - 10:50 a.m. TTh",
    class_location: " FIELD",
    class_instructor: "Pierce T L",
    class_name: "VAR PE 60",
    class_title: "Conditioning for Intercollegiate Sport 1 unit"
  },
  {
    class_number: "3437",
    class_time: "8 a.m. - 10:50 a.m. W",
    class_location: "HSS 156",
    class_instructor: "Westerband Y",
    class_name: "WGS 10",
    class_title:
      "Introduction to Women's, Gender, and Sexuality Studies 3 units"
  },
  {
    class_number: "3442",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 152",
    class_instructor: "Thing J P",
    class_name: "WGS 20",
    class_title:
      "Gender, Feminisms, and Social Movements: A Global Approach 3 units"
  },
  {
    class_number: "3443",
    class_time: "12:45 p.m.  -  3:35 p.m. W",
    class_location: "HSS 152",
    class_instructor: "Westerband Y",
    class_name: "WGS 30",
    class_title: "Women, Gender, and Sexuality in Popular Culture 3 units"
  },
  {
    class_number: "3444",
    class_time: "12:45 p.m.  -  2:05 p.m. TTh",
    class_location: "HSS 155",
    class_instructor: "Westerband Y",
    class_name: "WGS 40",
    class_title: "Introduction to LGBTQ Studies 3 units"
  },
  {
    class_number: "3445",
    class_time: "11:15 a.m. - 12:35 p.m. TTh",
    class_location: "HSS 154",
    class_instructor: "Klein M C",
    class_name: "WGS 80",
    class_title:
      "Women's, Gender, and Sexuality Studies Leadership Practicum 3 units"
  },
  {
    class_number: "3473",
    class_time: "Arrange  -  1 Hour ",
    class_location: " ",
    class_instructor: "Schultz C K",
    class_name: "WGS 88A",
    class_title:
      "Independent Studies in Women's, Gender, and Sexuality Studies 1 unit"
  },
  {
    class_number: "3474",
    class_time: "Arrange  -  2 Hours ",
    class_location: " ",
    class_instructor: "Schultz C K",
    class_name: "WGS 88B",
    class_title:
      "Independent Studies in Women's, Gender, and Sexuality Studies 2 units"
  }
];
