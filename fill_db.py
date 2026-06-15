import requests

base_url = "http://localhost:3000"
projects_url = base_url + "/projects"

def get_requirements_url(project_id):
    return projects_url + f"/{project_id}/requirements"

def get_user_stories_url(project_id):
    return projects_url + f"/{project_id}/user-stories"

def get_acceptance_criteria_url(project_id, user_story_id):
    return projects_url + f"/{project_id}/user-stories/{user_story_id}/acceptance-criteria"

headers = {
    "Content-Type": "application/json",
    "User-Agent": "insomnia/2023.5.8"
}

def create_project_json(code, name, description):
    return {
        "code": code, #e.g. PJ-001
        "name": name,
        "description": description
    }

def create_requirements_json(code, description, isFunctional, category, priority, status):
    return {
        "code": code, #e.g. REQ-001 
        "description": description,
        "isFunctional": isFunctional, #True, False
        "category": category,
        "priority": priority, #Alta, Média, Baixa
        "status": status #Rascunho, Aprovado, Implementado
    }

def create_user_story_json(code, title, asA, iWant, soThat, priority, status):

    return {
        "code": code, #e.g. HU-001 
        "title": title,
        "asA": asA,
        "iWant": iWant,
        "soThat": soThat,
        "priority": priority, #Alta, Média, Baixa
        "status": status #A Fazer, Em Andamento, Concluído
    }

def create_acceptance_criterion_json(title, given, when, then):

    return {
        "title": title,
        "given": given,
        "when": when,
        "then": then,
    }

#FILL DATA HERE

requirements_data = [
    {
        "code": "REQ-001",
        "description": "O sistema deve permitir que novos clientes realizem um cadastro informando e-mail e senha.",
        "isFunctional": True,
        "category": "Cadastro",
        "priority": "Alta",
        "status": "Aprovado"
    },
    {
        "code": "REQ-002",
        "description": "O sistema deve exibir uma lista de produtos disponíveis com fotos, preços e descrições detalhadas.",
        "isFunctional": True,
        "category": "Catálogo",
        "priority": "Alta",
        "status": "Aprovado"
    },
    {
        "code": "REQ-003",
        "description": "O sistema deve permitir a inclusão, alteração de quantidade e exclusão de itens no carrinho de compras.",
        "isFunctional": True,
        "category": "Vendas",
        "priority": "Alta",
        "status": "Aprovado"
    },
    {
        "code": "REQ-004",
        "description": "O sistema deve processar o pagamento do pedido por meio de cartão de crédito de forma segura.",
        "isFunctional": True,
        "category": "Pagamento",
        "priority": "Alta",
        "status": "Aprovado"
    },
    {
        "code": "REQ-005",
        "description": "O sistema deve calcular automaticamente o valor do frete e o prazo de entrega com base no CEP informado.",
        "isFunctional": True,
        "category": "Entrega",
        "priority": "Média",
        "status": "Aprovado"
    },
    {
        "code": "REQ-006",
        "description": "O sistema deve disponibilizar uma tela para o cliente consultar o histórico e o andamento dos seus pedidos.",
        "isFunctional": True,
        "category": "Histórico",
        "priority": "Média",
        "status": "Aprovado"
    },
    {
        "code": "REQ-007",
        "description": "O sistema deve possuir um mecanismo para o usuário recuperar o acesso à sua conta caso esqueça a senha.",
        "isFunctional": True,
        "category": "Segurança",
        "priority": "Alta",
        "status": "Aprovado"
    },
    {
        "code": "REQ-008",
        "description": "O sistema deve enviar uma mensagem de confirmação por e-mail assim que o pedido for finalizado com sucesso.",
        "isFunctional": True,
        "category": "Notificação",
        "priority": "Baixa",
        "status": "Aprovado"
    },
    {
        "code": "REQ-009",
        "description": "O sistema deve gerar um painel visual consolidando o total de vendas do dia para o administrador da loja.",
        "isFunctional": True,
        "category": "Relatórios",
        "priority": "Média",
        "status": "Rascunho"
    },
    {
        "code": "REQ-010",
        "description": "O sistema deve permitir que o comprador solicite o cancelamento de um pedido antes que o produto seja enviado.",
        "isFunctional": True,
        "category": "Vendas",
        "priority": "Média",
        "status": "Aprovado"
    }
]

user_stories_data = [
    {
        "code": "HU-001",
        "title": "Cadastro de Cliente",
        "asA": "Cliente novo",
        "iWant": "criar uma conta no site preenchendo meus dados básicos",
        "soThat": "eu possa fazer compras e salvar meus endereços de entrega",
        "priority": "Alta",
        "status": "A Fazer"
    },
    {
        "code": "HU-002",
        "title": "Busca de Produtos",
        "asA": "Comprador",
        "iWant": "digitar o nome de um produto em uma barra de pesquisa",
        "soThat": "eu encontre rapidamente o item que desejo comprar",
        "priority": "Alta",
        "status": "A Fazer"
    },
    {
        "code": "HU-003",
        "title": "Gerenciamento do Carrinho de Compras",
        "asA": "Comprador",
        "iWant": "adicionar diferentes produtos em um carrinho virtual",
        "soThat": "eu possa juntar todos os itens e pagar por eles de uma só vez",
        "priority": "Alta",
        "status": "A Fazer"
    },
    {
        "code": "HU-004",
        "title": "Pagamento com Cartão de Crédito",
        "asA": "Cliente",
        "iWant": "inserir os dados do meu cartão de crédito na hora de fechar a compra",
        "soThat": "meu pagamento seja aprovado na hora e meu produto seja enviado mais rápido",
        "priority": "Alta",
        "status": "A Fazer"
    },
    {
        "code": "HU-005",
        "title": "Cálculo de Frete no Carrinho",
        "asA": "Cliente",
        "iWant": "informar o meu CEP antes de fechar o pedido",
        "soThat": "eu saiba quanto vou pagar de frete e em quantos dias o produto vai chegar",
        "priority": "Média",
        "status": "A Fazer"
    },
    {
        "code": "HU-006",
        "title": "Histórico de Pedidos",
        "asA": "Cliente cadastrado",
        "iWant": "acessar uma lista com todas as compras que já fiz no site",
        "soThat": "eu possa acompanhar as entregas atuais ou lembrar de itens que comprei antes",
        "priority": "Média",
        "status": "A Fazer"
    },
    {
        "code": "HU-007",
        "title": "Recuperação de Senha por E-mail",
        "asA": "Cliente cadastrado",
        "iWant": "solicitar uma nova senha informando apenas o meu e-mail",
        "soThat": "eu consiga voltar a acessar o site caso eu esqueça meus dados de entrada",
        "priority": "Alta",
        "status": "A Fazer"
    },
    {
        "code": "HU-008",
        "title": "E-mail de Confirmação do Pedido",
        "asA": "Comprador",
        "iWant": "receber uma mensagem automática no meu e-mail após a aprovação do pagamento",
        "soThat": "eu tenha um comprovante com tudo o que comprei e o valor pago",
        "priority": "Baixa",
        "status": "A Fazer"
    },
    {
        "code": "HU-009",
        "title": "Relatório Diário de Vendas",
        "asA": "Dono da loja online",
        "iWant": "ver um resumo financeiro com o total vendido no dia",
        "soThat": "eu consiga acompanhar o andamento das metas do meu negócio",
        "priority": "Média",
        "status": "A Fazer"
    },
    {
        "code": "HU-010",
        "title": "Cancelamento Automático de Pedido",
        "asA": "Cliente",
        "iWant": "clicar em um botão de cancelar na tela de detalhes do pedido ainda não enviado",
        "soThat": "eu possa desistir da compra de forma rápida sem precisar ligar no suporte",
        "priority": "Média",
        "status": "A Fazer"
    }
]

acceptance_criteria_data = [
    {
        "title": "Adicionar item disponível ao carrinho",
        "given": "Dado que o cliente está na página de um produto que possui estoque disponível",
        "when": "Quando ele clica no botão 'Adicionar ao Carrinho'",
        "then": "Então o produto é inserido na lista do carrinho e a quantidade total de itens é atualizada."
    },
    {
        "title": "Tentar adicionar item sem estoque disponível",
        "given": "Dado que o cliente está na tela de um produto que está esgotado",
        "when": "Quando ele tenta interagir com o botão de compra",
        "then": "Então o sistema desabilita o botão e exibe o aviso 'Este produto está indisponível no momento'."
    },
    {
        "title": "Aumentar a quantidade de um item de dentro do carrinho",
        "given": "Dado que o cliente abriu o carrinho e já possui um produto adicionado",
        "when": "Quando ele clica no botão com o sinal de mais (+) para aumentar a quantidade",
        "then": "Então o sistema aumenta a quantidade daquele item e atualiza o valor total a ser pago."
    },
    {
        "title": "Diminuir a quantidade de um item de dentro do carrinho",
        "given": "Dado que o cliente está no carrinho e possui duas unidades do mesmo produto",
        "when": "Quando ele clica no botão com o sinal de menos (-) para diminuir a quantidade",
        "then": "Então a quantidade cai para uma unidade e o valor total do carrinho diminui na mesma proporção."
    },
    {
        "title": "Remover completamente um item do carrinho",
        "given": "Dado que o cliente está visualizando a lista de itens adicionados ao carrinho",
        "when": "Quando ele clica no botão 'Remover' ou na lixeira ao lado do produto",
        "then": "Então aquele produto some da lista e o valor do carrinho é recalculado sem ele."
    },
    {
        "title": "Limpar todas as compras do carrinho de uma só vez",
        "given": "Dado que o cliente inseriu vários produtos dentro do seu carrinho",
        "when": "Quando ele clica na opção 'Esvaziar Carrinho'",
        "then": "Então todos os produtos são removidos e a tela exibe a mensagem 'Seu carrinho está vazio'."
    },
    {
        "title": "Manter os itens salvos ao sair e voltar ao site",
        "given": "Dado que o cliente adicionou um produto ao carrinho mas fechou a janela do site sem finalizar a compra",
        "when": "Quando ele abre o site novamente no mesmo aparelho após algumas horas",
        "then": "Então o carrinho deve carregar trazendo os mesmos produtos que ele havia deixado lá."
    },
    {
        "title": "Visualizar resumo completo com fotos e preços corretos",
        "given": "Dado que o cliente está com a página do carrinho de compras aberta",
        "when": "Quando ele confere a lista de itens",
        "then": "Então ele deve conseguir ver claramente a foto, o nome, o preço unitário e a quantidade de cada item escolhido."
    },
    {
        "title": "Aplicar um cupom de desconto que seja válido",
        "given": "Dado que o cliente está na tela de fechamento do carrinho e possui um cupom promocional ativo",
        "when": "Quando ele digita o código do cupom e clica em 'Aplicar'",
        "then": "Então o sistema recalcula o valor total aplicando o desconto e exibe uma mensagem de sucesso."
    },
    {
        "title": "Tentar aplicar um cupom de desconto vencido",
        "given": "Dado que o cliente está inserindo as informações de pagamento no carrinho",
        "when": "Quando ele digita um cupom que já perdeu a validade e clica em 'Aplicar'",
        "then": "Então o valor total permanece inalterado e o sistema avisa na tela que o cupom está vencido."
    }
]

if __name__ == "__main__":

    # example
    url = projects_url
    payload = create_project_json('PROJ-GV', "Marketplace", "Sistema de Gerenciamento de Vendas")
    response = requests.request("POST", url, json=payload, headers=headers)
    # response is JSON and contains id of created entity as "id": X, where X is an integer
    id = response.json()["id"]
    print(id)

    #FILL CODE HERE

    # Envio dos 10 requisitos criados acima para o projeto atual
    for req in requirements_data:
        req_url = get_requirements_url(id)
        req_payload = create_requirements_json(
            req["code"], req["description"], req["isFunctional"], 
            req["category"], req["priority"], req["status"]
        )
        req_response = requests.request("POST", req_url, json=req_payload, headers=headers)
        print(f"Requisito criado com o ID: {req_response.json().get('id')}")

    # Envio das 10 histórias de usuário e seleção da história HU-003 (Gerenciamento do Carrinho de Compras)
    selected_user_story_id = None
    for index, us in enumerate(user_stories_data):
        us_url = get_user_stories_url(id)
        us_payload = create_user_story_json(
            us["code"], us["title"], us["asA"], us["iWant"], 
            us["soThat"], us["priority"], us["status"]
        )
        us_response = requests.request("POST", us_url, json=us_payload, headers=headers)
        created_us_id = us_response.json().get("id")
        print(f"História de Usuário criada com o ID: {created_us_id}")
        
        # Seleciona o ID da terceira história da lista (HU-003) para vincular os critérios de aceitação
        if us["code"] == "HU-003":
            selected_user_story_id = created_us_id

    # Envio dos 10 critérios de aceitação para a história de usuário selecionada
    if selected_user_story_id:
        for ac in acceptance_criteria_data:
            ac_url = get_acceptance_criteria_url(id, selected_user_story_id)
            ac_payload = create_acceptance_criterion_json(
                ac["title"], ac["given"], ac["when"], ac["then"]
            )
            ac_response = requests.request("POST", ac_url, json=ac_payload, headers=headers)
            print(f"Critério de Aceitação criado com o ID: {ac_response.json().get('id')}")