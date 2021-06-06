FROM node:9-slim
ENV NUID_API_KEY = qbN7mo8aGv3eguyNMUWNp89XSfa3FrWl8Ok75FQ0
ENV DB_URI = mongodb+srv://nuid:nuid@123@cluster0.keudj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
ENV ACCESS_TOKEN_SECRET = kJDfqgroiqwuhdafkhiudbalskjlqwdoqywgdkqwhbdljauigcivdkjclxigciusdtfjfcfksdfvdftwevrjvalfkdxnhgbrluvtdekajgehjniydf
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD [ "npm","start"]