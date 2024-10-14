document.addEventListener("DOMContentLoaded", () => {
    carregarPartidos();
    carregarCandidatos();

    // Carregar os partidos
    function carregarPartidos() {
        fetch('http://localhost:4000/partidos')
            .then(response => response.json())
            .then(data => {
                console.log("Partidos:", data);  // Verifique a estrutura da resposta aqui
                let partidos = data.partidos || [];
                const listaPartidos = document.getElementById('lista-partidos')
                listaPartidos.innerHTML = ''
                // Se partidos for um objeto, transformamos em um array
                if (typeof partidos === 'object' && !Array.isArray(partidos)) {
                    partidos = [partidos]; // Transformar em um array com o único objeto
                }

                if (Array.isArray(partidos)) {
                    // Preencher o select de partidos
                    preencherSelectPartidos(partidos);
                    partidos.forEach(partido => {
                        const item = document.createElement('li');
                        item.textContent = `${partido.nome} - ${partido.sigla}`;
                        listaPartidos.appendChild(item);
                    });
                } else {
                    console.error('A resposta não é um array de partidos:', data);
                }
            })
            .catch(error => console.error('Erro ao carregar partidos:', error));
    }

    // Carregar os candidatos
    function carregarCandidatos() {
        fetch('http://localhost:4000/candidatos')
            .then(response => response.json())
            .then(data => {
                console.log("Candidatos:", data);  // Verifique a estrutura da resposta aqui
                const candidatos = data.candidatos || [];
                const listaCandidatos = document.getElementById("lista-candidatos");

                listaCandidatos.innerHTML = "";

                if (Array.isArray(candidatos)) {
                    candidatos.forEach(candidato => {
                        console.log("Candidato:", candidato);  // Verifique a estrutura do candidato
                        const partidoNome = candidato.partido ? candidato.partido.nome : "Partido Desconhecido";
                        const item = document.createElement('li');
                        item.textContent = `${candidato.nome} - ${partidoNome} - ${candidato.numero_candidato}`;
                        listaCandidatos.appendChild(item);
                    });
                } else {
                    console.error('A resposta dos candidatos não é um array:', data);
                }
            })
            .catch(error => console.error('Erro ao carregar candidatos:', error));
    }

    // Preencher o select de partidos no formulário de candidatos
    function preencherSelectPartidos(partidos) {
        const select = document.getElementById('partido-select');
        select.innerHTML = ''; // Limpar o select antes de adicionar novas opções
        partidos.forEach(partido => {
            const option = document.createElement('option');
            option.value = partido.id;  // Ajuste para garantir que o id do partido seja o valor
            option.textContent = `${partido.nome} (${partido.sigla})`;  // Exibe nome e sigla
            select.appendChild(option);
        });
    }

    // Evento para cadastrar partido
    document.getElementById("form-partido").addEventListener("submit", function(event) {
        event.preventDefault();
        const nomePartido = document.getElementById("nome-partido").value;
        const siglaPartido = document.getElementById("sigla-partido").value;
        const numRegistroPartido = document.getElementById("numero-registro-partido").value;

        fetch('http://localhost:4000/partidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nomePartido,
                sigla: siglaPartido,
                num_registro: numRegistroPartido
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                carregarPartidos(); // Recarregar partidos após adicionar
            } else {
                alert('Erro ao cadastrar partido.');
            }
        })
        .catch(error => console.error('Erro ao cadastrar partido:', error));
    });

    // Evento para cadastrar candidato
    document.getElementById("form-candidato").addEventListener("submit", function(event) {
        event.preventDefault();
    
        const nomeCandidato = document.getElementById("nome-candidato").value;
        const partidoSelect = document.getElementById("partido-select");
        const partidoId = partidoSelect.value;  // ID do partido selecionado
        const numeroCandidato = document.getElementById("numero-candidato").value;
    
        // Verificar se todos os campos estão preenchidos
        if (!nomeCandidato || !partidoId || !numeroCandidato) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
    
        fetch('http://localhost:4000/candidatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nomeCandidato,
                numero_candidato: numeroCandidato,
                partido: partidoId // Envia o ID do partido
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                carregarCandidatos(); // Recarregar candidatos após adicionar
            } else {
                alert('Erro ao cadastrar candidato.');
            }
        })
        .catch(error => console.error('Erro ao cadastrar candidato:', error));
    });
});
