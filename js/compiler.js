function readInstruction() { // analisador sintatico
    const currentAdress = document.getElementsByClassName("endereco")[programCounter];
    const textOfCurrentAdress = currentAdress.value;
    cxReadedComand.innerHTML = ` <p class="label inbox" >  ${textOfCurrentAdress} </p>`;

    let regex = new RegExp(regExpSyntaxValidation[0], "g");

    if (textOfCurrentAdress.match(regex) != null) { //add e os caralho
        aritmeticValidation(textOfCurrentAdress);
        return;
    }

    for (const regexValid of regExpSyntaxValidation[1]) { //load e store
        regex = new RegExp(regexValid, "g");
        if (textOfCurrentAdress.match(regex) != null) {
            dataMovementValidation(textOfCurrentAdress);
            return;
        }
    }

    regex = new RegExp(regExpSyntaxValidation[2], "g");

    if (textOfCurrentAdress.match(regex) != null) { //saltos condicionais
        branchingValidation(textOfCurrentAdress);
        return;
    }
    regex = new RegExp(regExpSyntaxValidation[3], "g");

    if (textOfCurrentAdress.match(regex)) {
        machineCycleControlValidation(textOfCurrentAdress)

        return;
    }
    interrupt();

}
function aritmeticValidation(instruction) {
    let regex = new RegExp(regExpCatchComand[0], "g");
    comand = instruction.match(regex)[0];

    if (!comandSet[0].includes(comand.toLowerCase())) {
        interrupt();
        return;
    }

    regex = new RegExp(regExpCatchParamters[0], "g");

    firstAtribute = parseInt(instruction.match(regex)[0]);
    secondAtribute = parseInt(instruction.match(regex)[1]);
    thirdAtribute = parseInt(instruction.match(regex)[2]);

    setInterpretMicroInstruction(secondAtribute, thirdAtribute, comand.toLowerCase().trim(), thirdAtribute, 0);
    routine(secondAtribute, thirdAtribute, comandSet[0].indexOf(comand.toLowerCase().trim()), firstAtribute, null);
}
function dataMovementValidation(instruction) {
    let regex = new RegExp(regExpCatchComand[1], "g");

    comand = instruction.match(regex)[0].trim();

    if (!comandSet[1].includes(comand.toLowerCase())) {
        interrupt();
        return;
    }

    regex = new RegExp(regExpCatchParamters[1], "g");
    firstAtribute = parseInt(instruction.match(regex)[0]);
    secondAtribute = parseInt(instruction.match(regex)[1]);


    const index = comandSet[1].indexOf(comand.toLowerCase());
     setInterpretMicroInstruction(
       index%2 != 0?secondAtribute:0, // registrador a
        0,          // registrador b
        index==0?"add":"load",         // aluintruction
        index !=1?firstAtribute:0, //registrador de saida

        index%2 == 0 ?secondAtribute: // endereco de memoria utilizado
            index == 3? 0: firstAtribute
    ); 
    dataMovementOperation();

}
function branchingValidation(instruction) {

    let regex = new RegExp(regExpCatchComand[2], "g");
    comand = instruction.match(regex)[0].trim();

    if (!comandSet[2].includes(comand.toLowerCase())) {
        interrupt();
        return;
    }

    regex = new RegExp(regExpCatchParamters[2], "g");
    firstAtribute = parseInt(instruction.match(regex)[0]);
    
    branchingOperation();
}

function machineCycleControlValidation(instruction) {
    let regex = new RegExp(regExpCatchComand[3], "g");
    comand = instruction.match(regex)[0].trim();

    console.log(comand);
    if (!comandSet[3].includes(comand.toLowerCase())) {
        interrupt();
        return;
    }

    machineCycleControlOperation();

}

function setInterpretMicroInstruction(aRegister, bRegister, aluOperation, outPutRegister, memoryAdress) {
    
    interpretedComand.innerText = 
    `${aRegister.toString(2)} | ${bRegister.toString(2)} | ${(comandSet.flat().indexOf(aluOperation).toString(2))} | ${outPutRegister.toString(2)} | ${memoryAdress.toString(2)}

    `;

}

