FROM nginx:alpine

# Copia os arquivos estáticos para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Copia a configuração do proxy reverso para dentro do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
