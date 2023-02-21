
const fileName = "data_base";
const input = `${fileName}.csv`;
let professors = [];

getData();

async function getData() {
    const response = await fetch(input);
    const data = await response.text();
    let rows = data.split(/\n/);
    rows = rows.map(row => row.replace("\r",""));

    let headers = rows[0].split(";");
    let professorsData = rows.splice(1,rows.length);

    professorsData.forEach(professor => {
        professor = professor.split(";");
        if (professor.length <= 1) return;

        let Professor = {};
        professor.forEach((attribute,index) =>{
            if (attribute == "") return;
            Professor[`${headers[index]}`] = attribute;
        })
        professors.push(Professor);
    });
    let cvs = createCVsHTML();
    cretaeHTMLSheets(cvs);
}

function createCVsHTML() {
    let cvs = professors.map(professor => {
        let contentHTML = `
            <div class="cv">
                <div class="photo-name">
                    <img src="${handleFoto(professor)}" alt="">
                    <h1>${professor.nombre}</h1>
                </div>
                <div class="description">
                    <p>${professor.perfil}</p>
                </div>
                <div class="contact-box">
                    <span>
                        <p>Contacto</p>
                    </span>
                    <ul>
                        <li>
                            <div class="icon-space"><ion-icon name="mail-open"></ion-icon></div>
                            <span>${professor.email}</span>
                        </li>
                        ${handleCvlac(professor)}
                        ${handleGoogle(professor)}
                    </ul>
                </div>
            </div>
        `;
        return contentHTML;
    });
    return cvs;
}

function handleFoto(professor) {
    if ("foto" in professor) return "img/"+professor.foto;
    else return "default/no-foto.png";
}

function handleCvlac(professor) {
    if (!("linkCvlac" in professor)) return ``;
    return `
        <li style="cursor: pointer;">
            <a href="${professor.linkCvlac}">
                <div class="icon-space"><ion-icon name="tv"></ion-icon></div>
                <span>Cvlac</span>
            </a>
        </li>
    `;
}

function handleGoogle(professor) {
    if (!("linkGoogle" in professor)) return ``;
    return `
        <li style="cursor: pointer;">
            <a href="${professor.linkGoogle}">
                <div class="icon-space"><ion-icon name="school"></ion-icon></div>
                <span>Google Scholar</span>
            </a>
        </li>
    `;
}

function cretaeHTMLSheets(cvs) {
    let book = document.querySelector(".book");
    let numCVS = cvs.length;
    let numSheets = Math.ceil( (numCVS + 1)/2 );
    let HTMLcontent = "";
    for (let i = 0; i < numSheets+1 ; i++) {
        HTMLcontent += `
            <div class="sheet">
                <div class="front face">
                    ${insertFront(i,cvs)}
                </div>
                <div class="back face">
                    ${insertBack(i,cvs)}
                </div>
            </div>
        `;
    }
    book.innerHTML = HTMLcontent;
    setSheets();
}

function insertFront(cont,cvs) {
    if (cont == 0) return inserFrontPage();
    else if (cont*2-1 >= cvs.length) return ``;
    else return cvs[cont*2-1];
}

function insertBack(cont,cvs) {
    if( cont*2 >= cvs.length) return ``;
    else return cvs[cont*2];
}

function inserFrontPage() {
    return `
        <div class="front-page">
            <p>Plantel de Profesores</p>
        </div>
    `;
}

let indexCurrentSheet = -0.5;
let sheets;

function setSheets() {
    sheets = [...document.querySelectorAll(".sheet")];
    setSheetSize();
    sortBook();
    
    sheets.forEach(sheet=>{
        sheet.addEventListener("click", e => {
            turnSheet(e.currentTarget);
        });
    });
    
    window.addEventListener("resize", function () {
        setSheetSize();
    });
}

function setSheetSize() {
    let margin = 50;
    let width, height;
    let newX = window.innerWidth - 2*margin;
    let newY = 5*newX/8;

    if (window.innerHeight - newY < 2*margin) {
        newY = window.innerHeight - 2*margin;
        newX = newY*8/5;
    }

    width = newX/2;
    height = newY;

    sheets.forEach(sheet=>{
        sheet.style.width = width + "px";
        sheet.style.height = height + "px";
    })

}

function turnSheet(currentSheet) {
    currentSheet.classList.toggle("turned");
    indexCurrentSheet = sheets.indexOf(currentSheet);
    let turned = currentSheet.classList.contains("turned")
    if (turned) indexCurrentSheet += 0.5;
    else indexCurrentSheet -= 0.5;
    sortBook();
}

function sortBook() {
    sheets.forEach((sheet,indexSheet) => {
        let diff =  Math.trunc( Math.abs( indexSheet - indexCurrentSheet ) );
        sheet.style.zIndex = (sheets.length - diff);
        if (indexCurrentSheet == -0.5) {
            sheet.classList.add("centered");
        } else {
            sheet.classList.remove("centered");
        }
    });
}
