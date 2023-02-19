
let sheets = [...document.querySelectorAll(".sheet")];
let indexCurrentSheet = -0.5;
sortBook();

sheets.forEach(sheet=>{
    sheet.addEventListener("click", e => {
        turnSheet(e.currentTarget);
    });
});


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
