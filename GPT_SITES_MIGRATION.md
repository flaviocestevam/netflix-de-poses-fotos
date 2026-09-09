# MIGRAÇÃO GPT SITES — NETFLIX DE POSES

## REGRA ABSOLUTA
Migrar 1:1. Não redesenhar, não melhorar, não alterar textos, imagens, cores, ordem, layout, espaçamentos ou componentes visuais.

ÚNICAS mudanças já aprovadas antes desta migração:
- catálogo aberto, sem login/cadastro;
- remover Conta e Minha Viagem da experiência;
- poses salvas localmente no navegador via localStorage;
- seção Salvas disponível sem conta.

## FONTE CANÔNICA
Esta branch `gpt-sites-copy` é a fonte da migração.
Não usar o site Lovable como ambiente de edição.

## ESTRUTURA FUNCIONAL QUE DEVE SER PRESERVADA
- / -> redireciona para /dashboard
- /dashboard
- /sos
- /modo-30s
- /roteiros
- /roteiros/$id
- /categorias/$slug
- /pose/$id
- /downloads
- /favoritos (Salvas)
- /como-usar

Rotas legadas /auth, /conta e /minha-viagem redirecionam para a experiência aberta aprovada.

## DADOS
O catálogo atual lê dados do Supabase.
Tabelas relevantes para a versão aberta:
- categories
- poses
- scripts
- script_poses
- downloads

Campos de imagem relevantes:
- categories.cover_image
- poses.image_url
- scripts.cover_image
- downloads.cover_image
- downloads.file_url

As migrations criam a estrutura das tabelas, mas não contêm a biblioteca completa de poses nem as 2.000 imagens.

## IMAGENS
As imagens NÃO estão armazenadas dentro do repositório.
O frontend lê URLs gravadas nos registros do banco (`image_url`, `cover_image`, `file_url`).
Não existe no código atual fluxo `supabase.storage.from(...)` para as poses.
Portanto, antes de desligar a infraestrutura atual, é obrigatório exportar o catálogo real e suas URLs e garantir que todas as imagens permaneçam acessíveis ou sejam copiadas para a hospedagem definitiva.

## SALVAS SEM LOGIN
A função de Salvas usa `src/lib/saved-poses.ts` e armazenamento local do navegador. Não depende de usuário ou autenticação.

## MIGRAÇÃO
1. Reproduzir esta interface 1:1 no GPT Sites/Work.
2. Preservar todas as rotas, textos e estilos acima.
3. Importar/exportar dados reais das tabelas públicas relevantes.
4. Preservar inicialmente as URLs de imagens para validar a cópia visual.
5. Depois mover as imagens para a hospedagem definitiva e trocar SOMENTE as URLs, sem alterar visual/conteúdo.
6. Testar comparação lado a lado com o original.
7. Só depois substituir o link entregue ao cliente e abandonar Lovable.

## PROIBIDO
- usar IA para redesenhar;
- inventar seções;
- remover conteúdo não autorizado;
- mudar copy;
- trocar imagens por placeholders;
- alterar cores/fontes/layout por preferência;
- desligar o site antigo antes da cópia estar validada.