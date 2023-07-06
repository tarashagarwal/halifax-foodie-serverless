
![image](https://github.com/tarashagarwal/halifax-foodie-serverless/assets/10708684/81659d20-b329-4362-a03d-5873954ea322)

docker stop $(docker ps -q -a) && docker rm $(docker ps -q -a) && docker build -t halifaxfoodie . && docker run -d -p 8080:80 halifaxfoodie
