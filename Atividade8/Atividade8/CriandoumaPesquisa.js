let idadeTotal = 0; 
let idadeMaior = 0;
let idadeMenor = Infinity;
let somaOpNegativa = 0;
let somaOpPositiva = 0;
let somaMas = 0;
let somaFem = 0;

const totalPessoa = 45;

for (let i = 0; i < totalPessoa; i++) {
    let idade;
    do {
        idade = parseInt(prompt(`Insira a idade da pessoa ${i + 1} (apenas números):`));
    } while (isNaN(idade) || idade <= 0); 
    idadeTotal += idade;

    
    idadeMaior = Math.max(idadeMaior, idade);
    idadeMenor = Math.min(idadeMenor, idade);

    
    const sexo = prompt(`Insira o sexo da pessoa ${i + 1} (M/F):`).toUpperCase();

    if (sexo === "M") {
        somaMas++;
    } else if (sexo === "F") {
        somaFem++;
    } else {
        alert("Sexo inválido. Por favor, insira M ou F.");
        i--;
        continue; 
    }

    let opiniao;
    do {
        opiniao = parseInt(prompt(`Insira a opinião da pessoa ${i + 1}: (1=Péssimo, 2=Regular, 3=Bom, 4=Ótimo)`));
    } while (![1, 2, 3, 4].includes(opiniao)); 

    if (opiniao === 1) {
        somaOpNegativa++;
    } else if (opiniao === 3 || opiniao === 4) {
        somaOpPositiva++;
    }
}


const idadeMedia = idadeTotal / totalPessoa;
const somaOpPositivaPorcentagem = (somaOpPositiva / totalPessoa) * 100;

console.log(`Média de idade das pessoas: ${idadeMedia.toFixed(2)}`);
console.log(`Idade da pessoa mais velha: ${idadeMaior}`);
console.log(`Idade da pessoa mais nova: ${idadeMenor}`);
console.log(`Quantidade de pessoas que responderam péssimo: ${somaOpNegativa}`);
console.log(`Porcentagem de pessoas que responderam ótimo e bom: ${somaOpPositivaPorcentagem.toFixed(2)}%`);
console.log(`Número de mulheres que responderam ao questionário: ${somaFem}`);
console.log(`Número de homens que responderam ao questionário: ${somaMas}`);
