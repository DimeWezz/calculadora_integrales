class CalculadoraIntegrales {
    constructor() {
        this.funcionesBasicas = {
            'x^n': (n) => `x^${n+1}/${n+1}`,
            'sin(x)': '-cos(x)',
            'cos(x)': 'sin(x)',
            'tan(x)': '-ln|cos(x)|',
            'cot(x)': 'ln|sin(x)|',
            'sec(x)': 'ln|sec(x)+tan(x)|',
            'csc(x)': 'ln|csc(x)-cot(x)|',
            'e^x': 'e^x',
            'ln(x)': 'x*ln(x) - x',
            '1/x': 'ln|x|',
            '1/sqrt(1-x**2)': 'arcsin(x)',
            'sec(x)**2': 'tan(x)',
            'csc(x)**2': '-cot(x)',
            'sec(x)*tan(x)': 'sec(x)',
            'csc(x)*cot(x)': '-csc(x)',
            'sinh(x)': 'cosh(x)',
            'cosh(x)': 'sinh(x)'
        };
    }

    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            a %= b;
            [a, b] = [b, a];
        }
        return a;
    }

    formatearFraccion(n, d) {
        if (n === 0) return "0";
        const comun = this.gcd(n, d);
        n /= comun;
        d /= comun;
        if (d < 0) { n = -n; d = -d; }
        let absN = Math.abs(n);
        return d === 1 ? absN.toString() : `${absN}/${d}`;
    }

    formatearNumero(num) {
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
    }

    calcularIntegral(funcion, tipo = 'indefinida', a = null, b = null) {
        try {
            let fLimpia = funcion.toLowerCase().replace(/\s+/g, '');
            fLimpia = fLimpia.replace(/\^/g, '**');
            fLimpia = fLimpia.replace(/e\*\*/g, 'exp');
            
            if (tipo === 'indefinida') {
                return this.integrarIndefinida(fLimpia);
            } else {
                return this.integrarDefinida(fLimpia, a, b);
            }
        } catch (error) {
            throw new Error('Error al procesar la integral: ' + error.message);
        }
    }

    integrarIndefinida(funcion) {
        let pasos = [];

        let fMostrar = funcion.replace(/\*\*/g, '^');

        pasos.push(`<div class="paso-header">PASO 1: Analizar la funcion a integrar</div>`);
        pasos.push(`<div class="paso-explicacion">La funcion que queremos integrar es: <strong>f(x) = ${fMostrar}</strong></div>`);
        pasos.push(`<div class="paso-explicacion">El simbolo <strong>∫</strong> significa "integral". La integral es la operacion contraria a la derivada, de la misma forma que la division es la operacion contraria a la multiplicacion. Si derivamos el resultado de una integral, volvemos a la funcion original.</div>`);
        pasos.push(`<div class="paso-explicacion">Cuando escribimos <strong>∫ f(x) dx</strong>, nos estamos preguntando: ¿que funcion teniamos antes de derivar? Es decir, ¿cual es la funcion F(x) tal que al derivarla obtenemos f(x)?</div>`);
        pasos.push(`<div class="paso-explicacion">El <strong>dx</strong> al final nos indica que la variable con la que trabajamos es <strong>x</strong>. Piensa en dx como un "pequeno trocito de x", y la integral como "sumar todos esos trocitos".</div>`);
        pasos.push(`<div class="paso-explicacion">Como esta integral NO tiene limites de inicio y fin (es indefinida), al resultado debemos agregarle <strong>+ C</strong>. La letra C representa cualquier numero constante (como 5, -3, 1/2, etc.). Esto es porque si a una funcion le sumamos una constante, su derivada sigue siendo la misma. Por ejemplo, la derivada de x² + 5 es 2x, y la derivada de x² - 3 tambien es 2x. Ambas son respuestas validas, por eso escribimos x² + C.</div>`);
        pasos.push('');

        for (let clave in this.funcionesBasicas) {
            if (funcion === clave || funcion === clave.replace(/\*\*/g, '^')) {
                let resultado = this.funcionesBasicas[clave];
                pasos.push(`<div class="paso-header">PASO 2: Buscar en la tabla de integrales</div>`);
                pasos.push(`<div class="paso-explicacion">Revisamos nuestra <strong>tabla de integrales fundamentales</strong> y encontramos que la funcion <strong>${fMostrar}</strong> aparece exactamente en ella.</div>`);
                pasos.push(`<div class="paso-explicacion">Esta tabla es como un "diccionario de integrales": contiene las funciones mas comunes con sus respectivas integrales. Los matematicos han descubierto estas formulas hace siglos, y nosotros podemos usarlas directamente sin tener que deducirlas cada vez.</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-formula">Formula de la tabla:  ∫ ${clave.replace(/\*\*/g, '^')} dx = ${resultado} + C</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">Simplemente reemplazamos en la formula y ese es el resultado. Es como cuando buscas una palabra en el diccionario: solo copias su significado.</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
                pasos.push(`<div class="paso-formula">∫ ${fMostrar} dx = ${resultado} + C</div>`);
                pasos.push(`<div class="paso-explicacion">El <strong>+ C</strong> representa la constante de integracion. Si derivamos ${resultado} + C, la C desaparece (porque la derivada de una constante es 0) y obtenemos exactamente ${fMostrar}. Esto comprueba que nuestra respuesta es correcta.</div>`);
                return { 
                    resultado: resultado + ' + C', 
                    pasos 
                };
            }
        }
        
        if (this.esPolinomio(funcion)) {
            let terminos = this.separarTerminos(funcion);
            let resultado = '';
            let detallesTerminos = [];

            pasos.push(`<div class="paso-header">PASO 2: Reconocer el tipo de funcion</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = ${fMostrar}</strong> es un <strong>polinomio</strong>.</div>`);
            pasos.push(`<div class="paso-explicacion">Un polinomio es una expresion matematica formada por la suma de varios terminos, donde cada termino tiene una variable (x) elevada a un numero entero (como 0, 1, 2, 3...) y multiplicada por un coeficiente (un numero). Por ejemplo: 3x² + 2x + 5 es un polinomio.</div>`);
            pasos.push(`<div class="paso-explicacion">Para integrar un polinomio, vamos a integrar cada termino por separado usando la <strong>regla de la potencia</strong> y luego sumaremos los resultados.</div>`);
            pasos.push('');

            pasos.push(`<div class="paso-header">PASO 3: Conocer la regla de la potencia</div>`);
            pasos.push(`<div class="paso-explicacion">La regla de la potencia es la herramienta mas importante para integrar. Dice lo siguiente:</div>`);
            pasos.push(`<div class="paso-formula">∫ xⁿ dx = x^(n+1) / (n+1) + C&nbsp;&nbsp;&nbsp;(siempre que n sea diferente de -1)</div>`);
            pasos.push(`<div class="paso-explicacion">En palabras mas sencillas: para integrar x elevado a n, hay que hacer dos cosas:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;1. <strong>Sumarle 1 al exponente</strong> (n se convierte en n+1)</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;2. <strong>Dividir por el nuevo exponente</strong> (dividir por n+1)</div>`);
            pasos.push(`<div class="paso-explicacion">Por ejemplo: ∫ x² dx = x³/3 + C. El 2 se convirtio en 3, y dividimos por 3.</div>`);
            pasos.push(`<div class="paso-explicacion">La unica excepcion es cuando n = -1, porque dividiriamos por cero. Ese caso lo veremos aparte.</div>`);
            pasos.push('');

            pasos.push(`<div class="paso-header">PASO 4: Descomponer el polinomio termino por termino</div>`);
            pasos.push(`<div class="paso-explicacion">Separamos el polinomio en ${terminos.length} termino${terminos.length !== 1 ? 's' : ''} y aplicamos la regla a cada uno:</div>`);
            pasos.push('');

            terminos.forEach((termino, index) => {
                let { num, den, exponente } = this.analizarTermino(termino);
                let terminoStr = '';
                let signo = (index > 0 ? (num >= 0 ? '+' : '-') : (num < 0 ? '-' : ''));
                let absNum = Math.abs(num);
                let coefMostrar = den === 1 ? absNum : `${absNum}/${den}`;
                if (coefMostrar === 1) coefMostrar = '';

                if (exponente !== -1) {
                    let nuevoExponente = exponente + 1;
                    let nuevoDen = den * nuevoExponente;
                    let absCoefStr = this.formatearFraccion(num, nuevoDen);
                    let varPart = nuevoExponente === 0 ? '' : (nuevoExponente === 1 ? 'x' : `x^${nuevoExponente}`);

                    if (index > 0) {
                        resultado += num >= 0 ? ' + ' : ' - ';
                    } else if (num < 0) {
                        resultado += '-';
                    }

                    if (absCoefStr.includes('/')) {
                        let [n, d] = absCoefStr.split('/');
                        terminoStr = (n === '1' ? (varPart || '1') : n + varPart) + '/' + d;
                    } else {
                        terminoStr = (absCoefStr === '1' ? (varPart || '1') : absCoefStr + varPart);
                    }
                    resultado += terminoStr;

                    let terminoOriginal = '';
                    if (coefMostrar) terminoOriginal += coefMostrar;
                    terminoOriginal += exponente === 0 ? '' : (exponente === 1 ? 'x' : `x^${exponente}`);

                    let varPartShow = nuevoExponente === 0 ? '1' : (nuevoExponente === 1 ? 'x' : `x^${nuevoExponente}`);
                    let coefCalc = num === 0 ? '0' : `${num}/${nuevoDen}`;
                    let terminoResultShow = '';
                    if (absCoefStr.includes('/')) {
                        let [n, d] = absCoefStr.split('/');
                        terminoResultShow = (n === '1' ? varPartShow : n + '·' + varPartShow) + '/' + d;
                    } else {
                        terminoResultShow = (absCoefStr === '1' ? '' : absCoefStr) + varPartShow;
                    }

                    detallesTerminos.push({ terminoOriginal, terminoResultShow, exponente, num, den });

                    let terminoParaMostrar = exponente === 0 ? (coefMostrar || '1') : (coefMostrar ? coefMostrar : '') + (exponente === 1 ? 'x' : `x^${exponente}`);
                    if (!terminoParaMostrar) terminoParaMostrar = '1';

                    pasos.push(`<div class="paso-destacado">Termino ${index + 1}: ${terminoParaMostrar}</div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Identificamos el exponente n = <strong>${exponente}</strong></div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Aplicamos la regla: n + 1 = ${exponente} + 1 = <strong>${nuevoExponente}</strong></div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Entonces: x^${exponente} se convierte en x^${nuevoExponente} / ${nuevoExponente}</div>`);
                    if (coefMostrar) {
                        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Como hay un coeficiente ${coefMostrar}, multiplicamos: ${coefMostrar} · x^${nuevoExponente} / ${nuevoExponente}</div>`);
                        pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ ${coefMostrar}x^${exponente} dx = ${coefMostrar} · (x^${nuevoExponente}/${nuevoExponente}) = ${terminoResultShow}</div>`);
                    } else {
                        pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ x^${exponente} dx = x^${nuevoExponente}/${nuevoExponente} = ${terminoResultShow}</div>`);
                    }
                    pasos.push('');
                } else {
                    let absCoefStr = this.formatearFraccion(num, den);
                    if (index > 0) resultado += num >= 0 ? ' + ' : ' - ';
                    else if (num < 0) resultado += '-';

                    if (absCoefStr.includes('/')) {
                        let [n, d] = absCoefStr.split('/');
                        terminoStr = (n === '1' ? "ln|x|" : n + "ln|x|") + "/" + d;
                    } else {
                        terminoStr = (absCoefStr === "1" ? "" : absCoefStr) + "ln|x|";
                    }
                    resultado += terminoStr;

                    let terminoOriginal = coefMostrar ? `${coefMostrar}/x` : '1/x';

                    pasos.push(`<div class="paso-destacado">Termino ${index + 1}: ${terminoOriginal}</div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Aquí el exponente es <strong>-1</strong>, lo que significa que tenemos 1/x.</div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;La regla de la potencia normal no funciona para n = -1, porque el denominador (n+1) se haria cero y no se puede dividir entre cero.</div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Para este caso existe una formula especial: <strong>∫ 1/x dx = ln|x| + C</strong></div>`);
                    pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;ln|x| es el logaritmo natural del valor absoluto de x. El valor absoluto |x| asegura que funcion para numeros negativos tambien.</div>`);
                    pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ ${terminoOriginal} dx = ${absCoefStr === '1' ? '' : absCoefStr}ln|x|</div>`);
                    pasos.push('');
                }
            });

            resultado += ' + C';
            let resultadoFinal = resultado.trim().replace(/\+\s\-/g, '- ');

            pasos.push(`<div class="paso-header">PASO 5: Juntar todos los resultados</div>`);
            pasos.push(`<div class="paso-explicacion">Ahora sumamos todos los terminos que integramos individualmente:</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-formula">∫ (${fMostrar}) dx = ${resultadoFinal}</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">El <strong>+ C</strong> al final es muy importante. Recuerda que C es cualquier numero constante. Si derivas este resultado, la C desaparece y obtienes la funcion original ${fMostrar}. Puedes comprobarlo tu mismo si conoces las reglas de derivacion.</div>`);

            return { resultado: resultadoFinal, pasos };
        }

        const matchTrinomio = funcion.match(/^1\/\(x\*\*2([+-]\d+)?\*?x([+-]\d+)\)$/);
        if (matchTrinomio) {
            let b = parseFloat(matchTrinomio[1]) || 0;
            let c = parseFloat(matchTrinomio[2]) || 0;
            let h = b / 2;
            let k = c - (h * h);

            pasos.push(`<div class="paso-header">PASO 2: Identificar la estructura de la funcion</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion que tenemos es: <strong>f(x) = 1/(x²${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c})</strong></div>`);
            pasos.push(`<div class="paso-explicacion">Observa que en el denominador hay un <strong>trinomio de segundo grado</strong> (una expresion con x², x y un numero). Este tipo de integral no se puede resolver directamente con la tabla basica, pero podemos transformarla.</div>`);
            pasos.push('<div class="paso-explicacion">El metodo que usaremos se llama <strong>completacion de cuadrados</strong>. Consiste en reescribir el trinomio como un binomio al cuadrado mas un numero, de la forma (x + h)² + k. Esto nos permitira usar formulas conocidas.</div>');
            pasos.push('');

            pasos.push(`<div class="paso-header">PASO 3: Aplicar completacion de cuadrados</div>`);
            pasos.push(`<div class="paso-explicacion">Completamos el cuadrado paso a paso:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;1. Tomamos el coeficiente de x, que es ${b}, lo dividimos entre 2: ${b}/2 = ${h}</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;2. Formamos (x + ${h})² = x² + ${b}x + ${h*h}</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;3. Ajustamos: x² + ${b}x + ${c} = (x + ${h})² + (${c} - ${h*h}) = <strong>(x + ${h})² + ${k}</strong></div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Ahora la integral se ha transformado en:</div>`);
            pasos.push(`<div class="paso-formula">∫ 1/[(x + ${h})² + ${k}] dx</div>`);
            pasos.push(`<div class="paso-explicacion">Esta forma ya se parece a las formulas que conocemos. El siguiente paso depende de si ${k} es positivo o negativo.</div>`);
            pasos.push('');

            if (k > 0) {
                let a = Math.sqrt(k);
                let aStr = this.formatearNumero(a);
                let res = `1/${aStr}*arctan((x+${h})/${aStr})`;

                pasos.push(`<div class="paso-header">PASO 4: Aplicar la formula del arco tangente</div>`);
                pasos.push(`<div class="paso-explicacion">Como el numero que queda k = ${k} es <strong>positivo</strong>, podemos usar la formula del arco tangente (arctan).</div>`);
                pasos.push(`<div class="paso-explicacion">La integral se parece a la forma <strong>∫ 1/(u² + a²) du</strong>, donde:</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Hacemos un cambio de variable: <strong>u = x + ${h}</strong></div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Identificamos la constante: <strong>a = √${k} = ${aStr}</strong></div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">La formula general para este caso es:</div>`);
                pasos.push(`<div class="paso-formula">∫ 1/(u² + a²) du = (1/a) · arctan(u/a) + C</div>`);
                pasos.push(`<div class="paso-explicacion">(arctan es la funcion arco tangente, que es la inversa de la tangente. Sirve para convertir una razon en un angulo.)</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">Reemplazamos u por (x + ${h}) y a por ${aStr}:</div>`);
                pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ 1/[(x+${h})² + ${aStr}²] dx = (1/${aStr}) · arctan((x+${h})/${aStr}) + C</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
                pasos.push(`<div class="paso-formula">∫ 1/(x²${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c}) dx = ${res} + C</div>`);
                return { resultado: res + ' + C', pasos };
            } else if (k < 0) {
                let a = Math.sqrt(Math.abs(k));
                let aStr = this.formatearNumero(a);
                let res = `1/${this.formatearNumero(2*a)}*ln|(x+${h}-${aStr})/(x+${h}+${aStr})|`;

                pasos.push(`<div class="paso-header">PASO 4: Aplicar la formula de diferencia de cuadrados</div>`);
                pasos.push(`<div class="paso-explicacion">Como el numero que queda k = ${k} es <strong>negativo</strong>, podemos reescribirlo como:</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;(x + ${h})² + (${k}) = (x + ${h})² - ${-k}</div>`);
                pasos.push(`<div class="paso-explicacion">Esto nos da la forma <strong>∫ 1/(u² - a²) du</strong>, donde:</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;u = x + ${h}</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;a = √${-k} = ${aStr}</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">La formula para este caso usa logaritmos:</div>`);
                pasos.push(`<div class="paso-formula">∫ 1/(u² - a²) du = (1/(2a)) · ln|(u - a)/(u + a)| + C</div>`);
                pasos.push(`<div class="paso-explicacion">(ln es el logaritmo natural. Las barras |...| significan valor absoluto, para asegurar que el logaritmo este definido.)</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">Reemplazamos u por (x + ${h}) y a por ${aStr}:</div>`);
                pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ 1/[(x+${h})² - ${aStr}²] dx = (1/${this.formatearNumero(2*a)}) · ln|(x+${h}-${aStr})/(x+${h}+${aStr})| + C</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
                pasos.push(`<div class="paso-formula">∫ 1/(x²${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c}) dx = ${res} + C</div>`);
                return { resultado: res + ' + C', pasos };
            }
        }

        const matchCuadradoSum = funcion.match(/^1\/\(x\*\*2\+(\d+)\)$/);
        if (matchCuadradoSum) {
            let a2 = parseFloat(matchCuadradoSum[1]);
            let a = Math.sqrt(a2);
            let aStr = this.formatearNumero(a);
            let res = `1/${aStr}*arctan(x/${aStr})`;

            pasos.push(`<div class="paso-header">PASO 2: Reconocer la forma de la integral</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = 1/(x² + ${a2})</strong> tiene una estructura especial: un 1 dividido por (x² mas un numero positivo).</div>`);
            pasos.push(`<div class="paso-explicacion">Esta es la forma de la <strong>integral del arco tangente</strong>, una formula clasica del calculo.</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">La formula general es:</div>`);
            pasos.push(`<div class="paso-formula">∫ 1/(x² + a²) dx = (1/a) · arctan(x/a) + C</div>`);
            pasos.push(`<div class="paso-explicacion">(arctan es la funcion arco tangente, que responde a la pregunta: ¿que angulo tiene tangente igual a este numero?)</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Comparamos con nuestra funcion: x² + ${a2} = x² + a², por lo tanto:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;a² = ${a2} &rarr; a = √${a2} = <strong>${aStr}</strong></div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Reemplazamos en la formula:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ 1/(x² + ${a2}) dx = (1/${aStr}) · arctan(x/${aStr}) + C</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
            pasos.push(`<div class="paso-formula">∫ 1/(x² + ${a2}) dx = ${res} + C</div>`);
            return { resultado: res + ' + C', pasos };
        }

        const matchCuadradoRest = funcion.match(/^1\/\(x\*\*2-(\d+)\)$/);
        if (matchCuadradoRest) {
            let a2 = parseFloat(matchCuadradoRest[1]);
            let a = Math.sqrt(a2);
            let aStr = this.formatearNumero(a);
            let res = `1/${this.formatearNumero(2*a)}*ln|(x-${aStr})/(x+${aStr})|`;

            pasos.push(`<div class="paso-header">PASO 2: Reconocer la forma de la integral</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = 1/(x² - ${a2})</strong> tiene un denominador que es una <strong>diferencia de cuadrados</strong>: x² - a².</div>`);
            pasos.push(`<div class="paso-explicacion">Cuando el denominador es una resta de dos cuadrados, la integral se resuelve con logaritmos:</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Formula general:</div>`);
            pasos.push(`<div class="paso-formula">∫ 1/(x² - a²) dx = (1/(2a)) · ln|(x - a)/(x + a)| + C&nbsp;&nbsp;&nbsp;(para |x| &gt; a)</div>`);
            pasos.push(`<div class="paso-explicacion">(ln es logaritmo natural, y las barras |...| indican valor absoluto. Dividimos (x - a) entre (x + a) y tomamos el logaritmo de esa proporcion.)</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Identificamos nuestra constante:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;a² = ${a2} &rarr; a = √${a2} = <strong>${aStr}</strong></div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Reemplazamos en la formula:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ 1/(x² - ${a2}) dx = (1/${this.formatearNumero(2*a)}) · ln|(x - ${aStr})/(x + ${aStr})| + C</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
            pasos.push(`<div class="paso-formula">∫ 1/(x² - ${a2}) dx = ${res} + C</div>`);
            return { resultado: res + ' + C', pasos };
        }

        const matchPartesXExp = funcion.match(/^x\*exp\(x\)$/);
        if (matchPartesXExp) {
            pasos.push(`<div class="paso-header">PASO 2: Identificar el metodo necesario</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = x · eˣ</strong> es un <strong>producto de dos funciones</strong>: la funcion "x" multiplicada por la funcion "e elevado a x".</div>`);
            pasos.push(`<div class="paso-explicacion">Cuando una integral tiene un producto de funciones que no se puede separar, necesitamos un metodo especial llamado <strong>integracion por partes</strong>.</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 3: Conocer la formula de integracion por partes</div>`);
            pasos.push(`<div class="paso-explicacion">La formula de integracion por partes es:</div>`);
            pasos.push(`<div class="paso-formula">∫ u · dv = u · v - ∫ v · du</div>`);
            pasos.push(`<div class="paso-explicacion">Esta formula convierte una integral complicada (∫ u·dv) en una mas sencilla (∫ v·du). La clave esta en elegir correctamente quien es <strong>u</strong> (lo que vamos a derivar) y quien es <strong>dv</strong> (lo que vamos a integrar).</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 4: Elegir quien es u y quien es dv</div>`);
            pasos.push(`<div class="paso-explicacion">Para la integral ∫ x·eˣ dx, tenemos que decidir:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Elegimos <strong>u = x</strong> porque al derivar x obtenemos 1, que es mas simple. Si eligieramos al reves, se complicaria.</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Elegimos <strong>dv = eˣ dx</strong> porque la integral de eˣ es eˣ, que es facil de calcular.</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 5: Calcular du (derivada de u) y v (integral de dv)</div>`);
            pasos.push(`<div class="paso-explicacion">Ahora hacemos los calculos:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Derivamos u: u = x &rarr; du = 1 · dx = <strong>dx</strong></div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;Integramos dv: dv = eˣ dx &rarr; v = ∫ eˣ dx = <strong>eˣ</strong></div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 6: Aplicar la formula</div>`);
            pasos.push(`<div class="paso-explicacion">Sustituimos u, v, du y dv en la formula ∫ u·dv = u·v - ∫ v·du:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ x·eˣ dx = x·eˣ - ∫ eˣ dx</div>`);
            pasos.push(`<div class="paso-explicacion">La integral que nos queda (∫ eˣ dx) es sencilla, la encontramos en la tabla basica:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ eˣ dx = eˣ + C</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 7: Obtener el resultado final</div>`);
            pasos.push(`<div class="paso-explicacion">Reemplazamos y simplificamos:</div>`);
            pasos.push(`<div class="paso-formula">∫ x·eˣ dx = x·eˣ - eˣ + C = eˣ · (x - 1) + C</div>`);
            pasos.push(`<div class="paso-explicacion">Para comprobar que esta bien, podemos derivar el resultado: la derivada de x·eˣ - eˣ es (1·eˣ + x·eˣ) - eˣ = x·eˣ, que es exactamente nuestra funcion original. Esto confirma que la integral esta correcta.</div>`);
            return { resultado: `x*exp(x) - exp(x) + C`, pasos };
        }

        const matchPartesXSin = funcion.match(/^x\*sin\(x\)$/);
        if (matchPartesXSin) {
            pasos.push(`<div class="paso-header">PASO 2: Identificar el metodo necesario</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = x · sin(x)</strong> es un <strong>producto de dos funciones</strong>: x multiplicado por seno de x.</div>`);
            pasos.push(`<div class="paso-explicacion">Al igual que con x·eˣ, necesitamos el metodo de <strong>integracion por partes</strong>.</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 3: Recordar la formula</div>`);
            pasos.push(`<div class="paso-formula">∫ u · dv = u · v - ∫ v · du</div>`);
            pasos.push('<div class="paso-explicacion">Recordemos que esta formula nos permite transformar una integral en otra que esperamos sea mas facil de resolver.</div>');
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 4: Elegir u y dv</div>`);
            pasos.push(`<div class="paso-explicacion">Para ∫ x·sin(x) dx, elegimos:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>u = x</strong> (porque al derivar x obtenemos 1, simplificando la integral)</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>dv = sin(x) dx</strong> (porque la integral de sin(x) es -cos(x), que es facil de calcular)</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 5: Calcular du y v</div>`);
            pasos.push(`<div class="paso-explicacion">Derivamos u e integramos dv:</div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;u = x &rarr; du = 1 · dx = <strong>dx</strong></div>`);
            pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;dv = sin(x) dx &rarr; v = ∫ sin(x) dx = <strong>-cos(x)</strong></div>`);
            pasos.push(`<div class="paso-explicacion">(La integral de seno es menos coseno, porque la derivada de cos(x) es -sin(x), entonces la derivada de -cos(x) es sin(x).)</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 6: Aplicar la formula paso a paso</div>`);
            pasos.push(`<div class="paso-explicacion">Sustituimos en la formula:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ x·sin(x) dx = x · (-cos(x)) - ∫ (-cos(x)) dx</div>`);
            pasos.push(`<div class="paso-explicacion">Simplificamos: x · (-cos(x)) = <strong>-x·cos(x)</strong></div>`);
            pasos.push(`<div class="paso-explicacion">El signo menos delante de la integral y el signo menos dentro se cancelan: -∫ (-cos(x)) dx = <strong>+∫ cos(x) dx</strong></div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">= -x·cos(x) + ∫ cos(x) dx</div>`);
            pasos.push(`<div class="paso-explicacion">La integral de cos(x) es inmediata:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ cos(x) dx = sin(x) + C</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">PASO 7: Resultado final</div>`);
            pasos.push(`<div class="paso-formula">∫ x·sin(x) dx = -x·cos(x) + sin(x) + C</div>`);
            pasos.push(`<div class="paso-explicacion">Podemos verificarlo derivando: la derivada de -x·cos(x) es -cos(x) + x·sin(x) (por la regla del producto), y la derivada de sin(x) es cos(x). Sumando: (-cos(x) + x·sin(x)) + cos(x) = x·sin(x). Correcto!</div>`);
            return { resultado: `-x*cos(x) + sin(x) + C`, pasos };
        }

        const patrones = [
            { reg: /^(-?[\d\/\.]*)\*?sin\(([\d\/\.]*)x\)$/, func: 'cos', sign: '-', name: 'seno', formula: '∫ sin(ax) dx = -(1/a)·cos(ax) + C' },
            { reg: /^(-?[\d\/\.]*)\*?cos\(([\d\/\.]*)x\)$/, func: 'sin', sign: '', name: 'coseno', formula: '∫ cos(ax) dx = (1/a)·sin(ax) + C' },
            { reg: /^(-?[\d\/\.]*)\*?exp\(([\d\/\.]*)x\)$/, func: 'exp', sign: '', name: 'exponencial', formula: '∫ e^(ax) dx = (1/a)·e^(ax) + C' },
            { reg: /^(-?[\d\/\.]*)\*?sec\(([\d\/\.]*)x\)\*\*2$/, func: 'tan', sign: '', name: 'secante cuadrada', formula: '∫ sec²(ax) dx = (1/a)·tan(ax) + C' }
        ];

        const matchAx = funcion.match(/^(\d+)\*\*x$/);
        if (matchAx) {
            let base = parseFloat(matchAx[1]);
            let res = `${base}^x/ln(${base})`;

            pasos.push(`<div class="paso-header">PASO 2: Identificar la forma de la integral</div>`);
            pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = ${base}ˣ</strong> es una <strong>funcion exponencial</strong>. La x esta en el exponente, no en la base.</div>`);
            pasos.push(`<div class="paso-explicacion">Esto es diferente de xⁿ (potencia) donde la x esta en la base. Para funciones exponenciales como aˣ, la formula es distinta.</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Formula general para integrales exponenciales:</div>`);
            pasos.push(`<div class="paso-formula">∫ aˣ dx = aˣ / ln(a) + C&nbsp;&nbsp;&nbsp;(para a > 0, a ≠ 1)</div>`);
            pasos.push(`<div class="paso-explicacion">(ln(a) es el logaritmo natural de a, que es simplemente un numero constante.)</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">En nuestro caso, a = <strong>${base}</strong>. Aplicamos la formula:</div>`);
            pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ ${base}ˣ dx = ${base}ˣ / ln(${base}) + C</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-explicacion">Calculamos ln(${base}) ≈ ${Math.log(base).toFixed(4)} (es una constante, por lo que solo estamos dividiendo la funcion original por ese numero).</div>`);
            pasos.push('');
            pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
            pasos.push(`<div class="paso-formula">∫ ${base}ˣ dx = ${res} + C</div>`);
            return { resultado: `${base}^x/ln(${base}) + C`, pasos };
        }

        for (let p of patrones) {
            let match = funcion.match(p.reg);
            if (match) {
                let kStr = match[1] || '1';
                if (kStr === '-') kStr = '-1';
                let aStr = match[2] || '1';
                
                let k = kStr.includes('/') ? (kStr.split('/')[0] / kStr.split('/')[1]) : parseFloat(kStr);
                let a = aStr.includes('/') ? (aStr.split('/')[0] / aStr.split('/')[1]) : parseFloat(aStr);
                
                let nuevoNum = p.sign === '-' ? -k : k;
                let signPrefix = nuevoNum < 0 ? '-' : '';
                let absCoefStr = this.formatearFraccion(Math.abs(nuevoNum), a);
                let funcPart = `${p.func}(${a === 1 ? 'x' : aStr + 'x'})`;
                
                let finalTerm = "";
                if (absCoefStr.includes('/')) {
                    let [n, d] = absCoefStr.split('/');
                    finalTerm = (n === '1' ? funcPart : n + funcPart) + '/' + d;
                } else {
                    finalTerm = (absCoefStr === '1' ? '' : absCoefStr) + funcPart;
                }

                let kMostrar = kStr;
                let signoCoef = k < 0 ? '-' : '';
                let kMostrarFinal = Math.abs(k) === 1 ? (kStr.includes('/') ? kStr : '') : Math.abs(k);
                let kPart = kStr === '1' ? '' : (kStr === '-1' ? '-' : kStr);

                pasos.push(`<div class="paso-header">PASO 2: Identificar la forma de la integral</div>`);
                pasos.push(`<div class="paso-explicacion">La funcion <strong>f(x) = ${funcion.replace(/\*\*/g, '^')}</strong> es una funcion <strong>${p.name}</strong>, pero con el argumento multiplicado por ${a === 1 ? '1 (es decir, es simple)' : a}.</div>`);
                pasos.push(`<div class="paso-explicacion">Cuando la funcion trigonometrica o exponencial tiene un numero multiplicando a la x (como sin(ax), cos(ax), e^(ax)), necesitamos ajustar la formula basica.</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">PASO 3: Formula general para este caso</div>`);
                pasos.push(`<div class="paso-explicacion">La formula que vamos a usar es:</div>`);
                pasos.push(`<div class="paso-formula">${p.formula}</div>`);
                pasos.push(`<div class="paso-explicacion">El ${a === 1 ? '1/a' : '1/' + a} aparece porque cuando hacemos una sustitucion del tipo u = ax, el dx se convierte en du/a, y ese 1/a sale de la integral como factor.</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">PASO 4: Aplicar la formula</div>`);
                pasos.push(`<div class="paso-explicacion">Identificamos los valores:</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;a = ${a} (el numero que multiplica a x)</div>`);
                pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;El coeficiente que multiplica es ${kStr === '1' ? '1 (no hay)' : kStr}</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-explicacion">Aplicando la formula directamente:</div>`);
                pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">∫ ${funcion.replace(/\*\*/g, '^')} dx = ${signPrefix}${finalTerm} + C</div>`);
                pasos.push('');
                pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
                pasos.push(`<div class="paso-formula">∫ ${funcion.replace(/\*\*/g, '^')} dx = ${signPrefix}${finalTerm} + C</div>`);

                return { resultado: signPrefix + finalTerm + ' + C', pasos };
            }
        }
        
        pasos.push(`<div class="paso-header">PASO 2: Reconocimiento de la funcion</div>`);
        pasos.push(`<div class="paso-explicacion">Hemos analizado la funcion <strong>f(x) = ${fMostrar}</strong> y no coincide con ninguna de las formas elementales que esta calculadora tiene programadas.</div>`);
        pasos.push('');
        pasos.push(`<div class="paso-header">Posibles metodos avanzados</div>`);
        pasos.push(`<div class="paso-explicacion">Dependiendo de la forma exacta de la funcion, podrian aplicarse estos metodos:</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>Integracion por partes:</strong> para productos de funciones como x·sin(x), x·eˣ, ln(x), etc.</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>Sustitucion o cambio de variable:</strong> cuando la funcion contiene una funcion dentro de otra (composicion).</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>Fracciones parciales:</strong> para fracciones con denominadores que se puedan factorizar.</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>Sustitucion trigonometrica:</strong> para integrales con raices cuadradas como √(a² - x²).</div>`);
        pasos.push('');
        pasos.push(`<div class="paso-explicacion">Tambien es posible que esta funcion <strong>no tenga una primitiva elemental</strong>, es decir, su integral no se puede escribir usando funciones basicas (polinomios, senos, cosenos, logaritmos, etc.). Esto es mas comun de lo que parece.</div>`);
        pasos.push('');
        pasos.push(`<div class="paso-explicacion"><strong>Sugerencia:</strong> Si necesitas el valor numerico del area bajo la curva, cambia al modo "Integral Definida" e ingresa limites de integracion. La calculadora usara el metodo de Simpson para aproximar el resultado numericamente.</div>`);
        return { 
            resultado: 'Requiere Cálculo Numérico o Métodos Avanzados', 
            pasos,
            sugerencia: 'Para funciones complejas, usa el modo "Integral Definida" para obtener el valor numérico exacto del área.'
        };
    }

    integrarDefinida(funcion, a, b) {
        let pasos = [];
        let signo = 1;
        let fMostrar = funcion.replace(/\*\*/g, '^');

        if (a > b) {
            pasos.push(`<div class="paso-header"> NOTA: Inversión de límites</div>`);
            pasos.push(`<div class="paso-explicacion">El límite inferior a = ${a} es mayor que el superior b = ${b}.</div>`);
            pasos.push(`<div class="paso-explicacion">Aplicamos la propiedad: <strong>∫ₐᵇ f(x)dx = -∫ᵇₐ f(x)dx</strong></div>`);
            pasos.push(`<div class="paso-explicacion">Por lo tanto, cambiamos el orden de los límites e invertimos el signo.</div>`);
            pasos.push('');
            [a, b] = [b, a];
            signo = -1;
        }

        pasos.push(`<div class="paso-header">PASO 1: Comprender la integral definida</div>`);
        pasos.push(`<div class="paso-explicacion">Vamos a calcular el <strong>area neta</strong> bajo la curva <strong>f(x) = ${fMostrar}</strong> desde x = ${a} hasta x = ${b}.</div>`);
        pasos.push(`<div class="paso-formula">∫<sub>${a}</sub><sup>${b}</sup> ${fMostrar} dx</div>`);
        pasos.push(`<div class="paso-explicacion">A diferencia de la integral indefinida (que da una funcion con + C), la integral definida da un <strong>numero</strong> que representa el area entre la curva y el eje X, en el intervalo indicado.</div>`);
        pasos.push(`<div class="paso-explicacion">Si la curva queda por encima del eje X, el area es positiva. Si queda por debajo, el area es negativa (se llama "area neta").</div>`);
        pasos.push('');
        
        pasos.push(`<div class="paso-header">PASO 2: Elegir el metodo de aproximacion</div>`);
        pasos.push(`<div class="paso-explicacion">Como muchas integrales definidas no se pueden calcular exactamente con lapiz y papel, usamos un metodo numerico llamado <strong>Metodo de Simpson</strong> (o regla de Simpson).</div>`);
        pasos.push(`<div class="paso-explicacion">Este metodo consiste en dividir el area en muchas franjas verticales y aproximar cada franja con una parabola (una curva en forma de U o U invertida). Luego se suma el area de todas las parabolas.</div>`);
        pasos.push('');
        
        const n = 1000;
        const h = (b - a) / n;
        
        pasos.push(`<div class="paso-explicacion">Dividimos el intervalo [${a}, ${b}] en <strong>n = ${n}</strong> franjas (subintervalos) del mismo ancho. Cuantas mas franjas, mas preciso es el resultado.</div>`);
        pasos.push(`<div class="paso-explicacion">El ancho de cada franja (h) se calcula asi:</div>`);
        pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">h = (b - a) / n = (${b} - ${a}) / ${n} = ${h.toFixed(6)}</div>`);
        pasos.push('');
        
        let fa = this.evaluarFuncion(funcion, a);
        let fb = this.evaluarFuncion(funcion, b);
        
        if (!isFinite(fa) || !isFinite(fb)) throw new Error("La funcion es indefinida en los limites seleccionados.");

        pasos.push(`<div class="paso-header">PASO 3: Evaluar la funcion en los extremos</div>`);
        pasos.push(`<div class="paso-explicacion">Primero calculamos el valor de f(x) en el punto inicial y final:</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;f(${a}) = ${this.formatearNumero(fa)}</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;f(${b}) = ${this.formatearNumero(fb)}</div>`);
        pasos.push('');

        let suma = fa + fb;
        
        pasos.push(`<div class="paso-header">PASO 4: Recorrer los puntos interiores</div>`);
        pasos.push(`<div class="paso-explicacion">La formula de Simpson combina los valores de la funcion en todos los puntos con diferentes pesos:</div>`);
        pasos.push(`<div class="paso-formula">S = (h/3) · [f(a) + f(b) + 2·Σf(x_par) + 4·Σf(x_impar)]</div>`);
        pasos.push(`<div class="paso-explicacion">Recorremos los ${n-1} puntos interiores. A cada valor lo multiplicamos por:</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>2</strong> si la posicion del punto es par</div>`);
        pasos.push(`<div class="paso-explicacion">&nbsp;&nbsp;<strong>4</strong> si la posicion del punto es impar</div>`);
        pasos.push(`<div class="paso-explicacion">Esto se debe a que la regla de Simpson usa pares de intervalos para formar las parabolas.</div>`);
        pasos.push('');
        
        for (let i = 1; i < n; i++) {
            let x = a + i * h;
            if (i % 2 === 0) {
                let val = this.evaluarFuncion(funcion, x);
                suma += 2 * (isFinite(val) ? val : 0);
            } else {
                let val = this.evaluarFuncion(funcion, x);
                suma += 4 * (isFinite(val) ? val : 0);
            }
        }
        
        let calculoTotal = (h / 3) * suma * signo;
        let resultado = this.formatearNumero(calculoTotal);

        pasos.push(`<div class="paso-header">PASO 5: Calcular el resultado final</div>`);
        pasos.push(`<div class="paso-explicacion">Aplicamos todos los valores en la formula de Simpson:</div>`);
        pasos.push(`<div class="paso-formula" style="font-size:14px; padding:6px 12px;">S = (${h.toFixed(6)} / 3) · ${this.formatearNumero(suma)} ${signo === -1 ? '· (-1)' : ''} ≈ ${resultado}</div>`);
        pasos.push('');
        pasos.push(`<div class="paso-header">RESULTADO FINAL</div>`);
        pasos.push(`<div class="paso-formula">∫<sub>${a}</sub><sup>${b}</sup> ${fMostrar} dx ≈ ${resultado}</div>`);
        pasos.push(`<div class="paso-explicacion">Este numero representa el area neta bajo la curva f(x) = ${fMostrar} desde x = ${a} hasta x = ${b}.</div>`);
        pasos.push(`<div class="paso-explicacion">El resultado es una <strong>aproximacion numerica</strong> usando n = ${n} subintervalos. El error tipico del metodo de Simpson con esta cantidad de intervalos es muy pequeno (menor a 0.001 en la mayoria de los casos).</div>`);
        
        return { 
            resultado: resultado, 
            pasos,
            tipo: 'numerico'
        };
    }

    evaluarFuncion(funcion, x) {
        try {
            let expr = funcion
                             .replace(/(\d)(?=[a-zA-Z\(])/g, '$1*')
                             .replace(/([x\)])(?=[0-9a-zA-Z\(])/g, '$1*')
                             .replace(/(\d)x/g, '$1*x')
                             .replace(/sin/g, 'Math.sin')
                             .replace(/cos/g, 'Math.cos')
                             .replace(/tan/g, 'Math.tan')
                             .replace(/ln/g, 'Math.log')
                             .replace(/log/g, 'Math.log10')
                             .replace(/exp/g, 'Math.exp')
                             .replace(/sqrt/g, 'Math.sqrt')
                             .replace(/abs/g, 'Math.abs')
                             .replace(/arctan/g, 'Math.atan')
                             .replace(/arcsin/g, 'Math.asin')
                             .replace(/sinh/g, 'Math.sinh')
                             .replace(/cosh/g, 'Math.cosh')
                             .replace(/PI/g, 'Math.PI')
                             .replace(/pi/g, 'Math.PI');
            
            expr = expr.replace(/\bx\b/g, `(${x})`).replace(/\*\*/g, '^').replace(/\^/g, '**');
            
            const resultado = new Function('return ' + expr)();
            if (isNaN(resultado)) return 0;
            return resultado;
        } catch (e) {
            throw new Error('Error al evaluar la función en x=' + x);
        }
    }

    esPolinomio(funcion) {
        if (funcion.includes('/x') || funcion === '1/x') return false;
        const tieneFunciones = ['sin', 'cos', 'tan', 'exp', 'log', 'ln', 'sqrt', 'sec', 'csc', 'cot', 'abs', 'sinh', 'cosh', 'arctan', 'arcsin'].some(f => funcion.includes(f));
        const letras = funcion.match(/[a-z]/g) || [];
        const tieneLetrasExtrañas = letras.some(l => l !== 'x');
        return /^[\d\sx\+\-\*\*\^\.\(\)\/]+$/.test(funcion) && !tieneLetrasExtrañas && !tieneFunciones;
    }

    separarTerminos(funcion) {
        let terminos = [];
        let terminoActual = '';
        let parentesis = 0;
        
        for (let i = 0; i < funcion.length; i++) {
            let char = funcion[i];
            
            if (char === '(') parentesis++;
            if (char === ')') parentesis--;
            
            if ((char === '+' || char === '-') && parentesis === 0 && terminoActual !== '') {
                terminos.push(terminoActual.trim());
                terminoActual = char === '-' ? '-' : '';
            } else {
                terminoActual += char;
            }
        }
        
        if (terminoActual.trim() !== '') {
            terminos.push(terminoActual.trim());
        }
        
        return terminos;
    }

    analizarTermino(termino) {
        let num = 1;
        let den = 1;
        let exponente = 0;
        
        if (/[a-z]/.test(termino)) {
            let coefMatch = termino.match(/^([^\*a-z]+)/);
            let coefStr = coefMatch ? coefMatch[1].replace(/\*$/, '') : '';
            
            if (coefStr === '' || coefStr === '+') { num = 1; den = 1; }
            else if (coefStr === '-') { num = -1; den = 1; }
            else if (coefStr.includes('/')) {
                let p = coefStr.split('/');
                num = parseFloat(p[0]) || 1;
                den = parseFloat(p[1]) || 1;
            }
            else { num = parseFloat(coefStr); den = 1; }
            
            let expoMatch = termino.match(/\*\*(-?[\d\.]+)$/);
            if (expoMatch) {
                exponente = parseFloat(expoMatch[1]);
            } else {
                exponente = 1;
            }
        } else {
            if (termino.includes('/')) {
                let p = termino.split('/');
                num = parseFloat(p[0]) || 1;
                den = parseFloat(p[1]) || 1;
            } else {
                num = parseFloat(termino) || 0;
                den = 1;
            }
            exponente = 0;
        }

        if (!Number.isInteger(num) && den === 1) {
            let s = num.toString();
            if (s.includes('.')) {
                let places = s.split('.')[1].length;
                den = Math.pow(10, places);
                num = Math.round(num * den);
            }
        }
        
        return { num, den, exponente };
    }

    generarPasosTexto(pasos) {
        return pasos.map(paso => {
            if (paso === '') return '<div class="paso-spacer"></div>';
            if (paso.startsWith('<')) return paso;
            return `<div class="paso-item">${paso}</div>`;
        }).join('');
    }
}

const calculadora = new CalculadoraIntegrales();

function calcularIntegral(mostrarPasos = false) {
    const funcionInput = document.getElementById('funcion').value;
    const tipoActivo = document.querySelector('.type-btn.active').dataset.type;
    const canvas = document.getElementById('graficaIntegral');
    
    if (!funcionInput) {
        mostrarError('Por favor, ingresa una función');
        return;
    }
    
    try {
        let resultado;
        if (tipoActivo === 'indefinida') {
            resultado = calculadora.calcularIntegral(funcionInput, 'indefinida');
            mostrarResultado(resultado, 'indefinida', mostrarPasos, funcionInput);
            canvas.style.display = 'none';
        } else {
            const a = parseFloat(document.getElementById('limiteInferior').value);
            const b = parseFloat(document.getElementById('limiteSuperior').value);
            
            if (isNaN(a) || isNaN(b)) {
                mostrarError('Por favor, ingresa límites válidos');
                return;
            }
            
            resultado = calculadora.calcularIntegral(funcionInput, 'definida', a, b);
            mostrarResultado(resultado, 'definida', mostrarPasos, funcionInput);
            dibujarGrafica(funcionInput, a, b);
        }
    } catch (error) {
        mostrarError(error.message);
    }
}

function convertirATeX(texto) {
    if (!texto) return '';
    return texto.toString()
        .replace(/\*\*/g, '^')
        .replace(/\^(\d+)/g, '^{$1}')
        .replace(/\*/g, ' \\cdot ')
        .replace(/([^\s\+\-]+)\/(\d+)/g, '\\frac{$1}{$2}')
        .replace(/exp\((.*?)\)/g, 'e^{$1}')
        .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
        .replace(/sin\((.*?)\)/g, '\\sin($1)')
        .replace(/cos\((.*?)\)/g, '\\cos($1)')
        .replace(/tan\((.*?)\)/g, '\\tan($1)')
        .replace(/sec\((.*?)\)/g, '\\sec($1)')
        .replace(/csc\((.*?)\)/g, '\\csc($1)')
        .replace(/cot\((.*?)\)/g, '\\cot($1)')
        .replace(/log\((.*?)\)/g, '\\log_{10}($1)')
        .replace(/ln\((.*?)\)/g, '\\ln($1)')
        .replace(/ln\|(.*?)\|/g, '\\ln| $1 |')
        .replace(/arctan\((.*?)\)/g, '\\arctan($1)')
        .replace(/arcsin\((.*?)\)/g, '\\arcsin($1)')
        .replace(/sinh\((.*?)\)/g, '\\sinh($1)')
        .replace(/cosh\((.*?)\)/g, '\\cosh($1)');
}

function mostrarResultado(resultado, tipo, mostrarPasos, original) {
    const resultadoDiv = document.getElementById('resultadoSection');
    const contenidoDiv = document.getElementById('resultadoContenido');
    const pasosDiv = document.getElementById('pasosContenido');
    const pasosSection = document.getElementById('pasosSection');
    
    resultadoDiv.style.display = 'block';
    contenidoDiv.className = 'result-content';
    
    let tex = "";
    if (tipo === 'indefinida') {
        tex = `\\int (${convertirATeX(original)}) \\, dx = ${convertirATeX(resultado.resultado)}`;
    } else {
        const a = document.getElementById('limiteInferior').value;
        const b = document.getElementById('limiteSuperior').value;
        tex = `\\int_{${a}}^{${b}} (${convertirATeX(original)}) \\, dx \\approx ${resultado.resultado}`;
    }

    try {
        katex.render(tex, contenidoDiv, { throwOnError: false, displayMode: true });
    } catch (e) {
        contenidoDiv.innerHTML = tex;
    }
    
    pasosSection.style.display = mostrarPasos ? 'block' : 'none';
    
    if (resultado.pasos) {
        pasosDiv.innerHTML = `
            <h4> Pasos de solución:</h4>
            ${calculadora.generarPasosTexto(resultado.pasos)}
        `;
    }

    if (mostrarPasos) {
        resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    if (resultado.sugerencia) {
        pasosDiv.innerHTML += `<p style="color: #666; margin-top: 10px;">${resultado.sugerencia}</p>`;
    }
}

function dibujarGrafica(funcion, a, b) {
    const canvas = document.getElementById('graficaIntegral');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const style = getComputedStyle(document.body);
    const axisColor = style.getPropertyValue('--border-color').trim();
    const inkColor = style.getPropertyValue('--ink-black').trim();
    
    ctx.clearRect(0, 0, w, h);
    
    const margin = 40;
    const rangeX = Math.max(Math.abs(a), Math.abs(b), 5) * 1.2;
    const stepX = (w - 2 * margin) / (2 * rangeX);
    const originX = w / 2;
    const originY = h / 2;
    
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(w, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, h);
    ctx.stroke();

    ctx.fillStyle = document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    let first = true;
    for (let xVal = a; xVal <= b; xVal += (b - a) / 100) {
        let yVal = calculadora.evaluarFuncion(funcion, xVal);
        let px = originX + xVal * stepX;
        let py = originY - yVal * stepX;
        if (first) {
            ctx.moveTo(px, originY);
            first = false;
        }
        ctx.lineTo(px, py);
    }
    ctx.lineTo(originX + b * stepX, originY);
    ctx.fill();

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < w; i++) {
        let xVal = (i - originX) / stepX;
        let yVal = calculadora.evaluarFuncion(funcion, xVal);
        let py = originY - yVal * stepX;
        if (i === 0) ctx.moveTo(i, py);
        else ctx.lineTo(i, py);
    }
    ctx.stroke();
}

function mostrarError(mensaje) {
    const resultadoDiv = document.getElementById('resultadoSection');
    const contenidoDiv = document.getElementById('resultadoContenido');
    const pasosDiv = document.getElementById('pasosContenido');
    
    resultadoDiv.style.display = 'block';
    contenidoDiv.className = 'result-content error';
    contenidoDiv.innerHTML = `${mensaje}`;
    pasosDiv.innerHTML = '';
}

function usarEjemplo(funcion) {
    document.getElementById('funcion').value = funcion;
    document.getElementById('resultadoSection').style.display = 'none';
}

document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const limites = document.getElementById('limitesSection');
        if (this.dataset.type === 'definida') {
            limites.style.display = 'flex';
        } else {
            limites.style.display = 'none';
        }
    });
});

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeLabel = document.getElementById('theme-label');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        themeLabel.textContent = "Modo Claro";
    } else {
        document.body.classList.remove('dark-mode');
        themeLabel.textContent = "Modo Oscuro";
    }    
}
toggleSwitch.addEventListener('change', switchTheme, false);

document.getElementById('funcion').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calcularIntegral();
    }
});