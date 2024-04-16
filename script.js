var canvas = document.getElementById('myCanvas');
var cv = canvas.getContext('2d');

var size = 20;
var mapx = 1500/size;
var mapy = 1000/size;

draw_background();
var head = [];
for(var i=0;i<10;i++) head[i]={x:0, y:0};
head[0].y=head[1].y=head[2].y=head[3].y=0;
head[4].y=head[5].y=24;
head[6].y=head[7].y=head[8].y=head[9].y=49;
head[0].x=head[6].x=0;
head[1].x=head[4].x=head[7].x=25;
head[2].x=head[5].x=head[8].x=50;
head[3].x=head[9].x=74;
var now = head;
var arr = [];
var group = [];
for(var i=0;i<mapx;i++){
    arr[i] = [];
    group[i] = [];
    for(var j=0;j<mapy;j++){
        group[i][j] = -1;
        arr[i][j] = [];
        arr[i][j][0] = "#ffffff";
        drawrect(i,j,arr[i][j][0]);
        for(var k=1;k<5;k++){
            arr[i][j][k] = 1;
            drawline(i,j,k,"#000000");
        }
    }
}
var color = ["#dd6545", "#ff843d", "#ebad31", "#e07000", "#ffe354", "#f2eb1f", "#e9f76a", "#ccfc2d", "#adeb5b", "#59d108"];
var status=0;
var time=0;
var posx=0, posy=0;
var no = [4,5,6,8,11,12,17,18,24,28,1,2,3,7,9,10,13,14,15,16,19,20,21,22,25,26,27,29,30,31]
var chosen = [];
for(var i=0;i<30;i++) chosen[i]=0;
for(var i=0;i<10;i++) chosen[i]=1;
var chosen_pos = head;
for(var i=10;i<30;i++) chosen_pos[i]={x:-1, y:-1};
var randomX=-1, randomY=-1;
var button_color = [["#80c000", "#a9e900", "#90d000", "#b0f000"], ["#c02000", "#e94900", "#d03000", "#f05000"]]
var buttonX = 0;
var buttonY = 0;
var current_ball = -1;
var place_ball_time = -1;
var group_cnt=[];
for(var i=0;i<10;i++) group_cnt[i]=0;
var back_randomX=-1, back_randomY=-1;
var queue=[], front=0, back=0;
var bfsing=0;
setInterval(function() {
    time++;
    var cnt=0;
    if(status!=0){
        startpick();
        place_ball();
    }else{
        for(var i=0;i<10;i++){
            var WallBreak = [];
            if (now[i].y > 0 && arr[now[i].x][now[i].y-1][0] == "#ffffff") {WallBreak.push(1);}
            if (now[i].x < mapx-1 && arr[now[i].x+1][now[i].y][0] == "#ffffff") {WallBreak.push(2);}
            if (now[i].y < mapy-1 && arr[now[i].x][now[i].y+1][0] == "#ffffff") {WallBreak.push(3);}
            if (now[i].x > 0 && arr[now[i].x-1][now[i].y][0] == "#ffffff") {WallBreak.push(4);}
            if(WallBreak.length>0){
                arr[now[i].x][now[i].y][0] = "#8EB5F1";
                drawrect(now[i].x, now[i].y, "#8EB5F1");
                var rand=Math.floor(Math.random()*WallBreak.length);
                arr[now[i].x][now[i].y][WallBreak[rand]]=0;
                drawline(now[i].x,now[i].y,WallBreak[rand],"#8EB5F1");
                if(WallBreak[rand]==1){now[i].y--;}
                if(WallBreak[rand]==2){now[i].x++;}
                if(WallBreak[rand]==3){now[i].y++;}
                if(WallBreak[rand]==4){now[i].x--;}
                arr[now[i].x][now[i].y][(WallBreak[rand]+1)%4+1]=0;
            }else{
                arr[now[i].x][now[i].y][0] = "#415c75";
                drawrect(now[i].x,now[i].y,"#415c75");
                if(now[i].y>0 && arr[now[i].x][now[i].y][1]==0 && arr[now[i].x][now[i].y-1][0]=="#8EB5F1"){drawline(now[i].x,now[i].y,1,"#415c75");now[i].y--;}else
                if(now[i].x<mapx-1 && arr[now[i].x][now[i].y][2]==0 && arr[now[i].x+1][now[i].y][0]=="#8EB5F1"){drawline(now[i].x,now[i].y,2,"#415c75");now[i].x++;}else
                if(now[i].y<mapy-1 && arr[now[i].x][now[i].y][3]==0 && arr[now[i].x][now[i].y+1][0]=="#8EB5F1"){drawline(now[i].x,now[i].y,3,"#415c75");now[i].y++;}else
                if(now[i].x>0 && arr[now[i].x][now[i].y][4]==0 && arr[now[i].x-1][now[i].y][0]=="#8EB5F1"){drawline(now[i].x,now[i].y,4,"#415c75");now[i].x--;}else cnt++;
            }
            arr[now[i].x][now[i].y][0]="#ff0000";
            drawrect(now[i].x, now[i].y, "#ff0000");
            group[now[i].x][now[i].y]=i;
        }
    }
    if(cnt==10 && status==0){
        status=1;
    }
    if(front!=back){
        cur=queue[back++];
        if(arr[cur.x][cur.y][1]==0 && cur.y>0 && arr[cur.x][cur.y-1][0]!=color[bfsing]) queue[front++]={x:cur.x, y:cur.y-1}, drawline(cur.x, cur.y, 1, color[bfsing]);
        if(arr[cur.x][cur.y][2]==0 && cur.x<mapx-1 &&  arr[cur.x+1][cur.y][0]!=color[bfsing]) queue[front++]={x:cur.x+1, y:cur.y}, drawline(cur.x, cur.y, 2, color[bfsing]);
        if(arr[cur.x][cur.y][3]==0 && cur.y<mapy-1 &&  arr[cur.x][cur.y+1][0]!=color[bfsing]) queue[front++]={x:cur.x, y:cur.y+1}, drawline(cur.x, cur.y, 3, color[bfsing]);
        if(arr[cur.x][cur.y][4]==0 && cur.x>0 &&  arr[cur.x-1][cur.y][0]!=color[bfsing]) queue[front++]={x:cur.x-1, y:cur.y}, drawline(cur.x, cur.y, 4, color[bfsing]);
        arr[cur.x][cur.y][0]=color[bfsing];
        drawrect(cur.x, cur.y, color[bfsing]);
    }
}, 1);
function bfs_group(i){
    bfsing=i;
    queue=[];
    front=0;
    back=0;
    queue[front++]=head[i];
}
function startpick(){
    for(var i=0;i<4;i++){
        for(var j=0;j<5;j++){
            cv.beginPath();
            cv.rect(1580+i*90-50, 100+j*100-50, 100, 100);
            cv.fillStyle = "#eeeeee";
            cv.fill();
            draw_marble(1580+i*90, 100+j*100, no[10+i*5+j], 1.5);
        }
    }
    for(var i=0;i<4;i++){
        for(var j=0;j<5;j++){
            if(10+i*5+j==current_ball) draw_marble(1580+i*90, 100+j*100, no[10+i*5+j], 2);
            if(chosen[10+i*5+j]==1){
                cv.beginPath();
                cv.arc(1580+i*90, 100+j*100, 37.5, 0, 2 * Math.PI);
                cv.fillStyle="#000000a0";
                cv.fill();
            }
        }
    }
    for(var i=0;i<30;i++){
        if(chosen[i]) draw_marble(chosen_pos[i].x*size+26, chosen_pos[i].y*size+26, no[i], 0.7)
    }
    draw_button();
}
function generate_random(cool){
    if(back_randomX==-1){
        back_randomX=Math.floor(Math.random()*mapx);
        back_randomY=Math.floor(Math.random()*mapy);
        while(group_cnt[group[back_randomX][back_randomY]]>=2){
            back_randomX=Math.floor(Math.random()*mapx);
            back_randomY=Math.floor(Math.random()*mapy);
        }
        group_cnt[group[back_randomX][back_randomY]]++;
    }
    if(cool) randomX=back_randomX;
    else randomY=back_randomY;
}
function place_ball(){
    if(place_ball_time<0) return;
    draw_background();
    draw_maze();
    startpick();
    draw_marble(randomX*size+25, randomY*size+25, no[current_ball], 5.4-(time-place_ball_time)/4);
    if(time==place_ball_time+20) place_ball_end();
}
function place_ball_end(){
    chosen[current_ball]=1;
    chosen_pos[current_ball]={x:randomX, y:randomY};
    current_ball=-1;
    status=1;
    buttonX=0;
    buttonY=0;
    place_ball_time=-1000;
    back_randomX=-1;
    back_randomY=-1;
    if(group_cnt[group[randomX][randomY]]>=2) bfs_group(group[randomX][randomY]);
    randomX=-1;
    randomY=-1;
}
function cursor(e) {
    posx = e.clientX;
    posy = e.clientY;
}
function cursorclick() {
    if(posx>=1560 && posx<=1870 && posy>=570 && posy<=770 && buttonX==0){
        buttonX=1;
        draw_button();
        generate_random(1);
    }
    if(posx>=1560 && posx<=1870 && posy>=800 && posy<=1000 && buttonY==0){
        buttonY=1;
        draw_button();
        generate_random(0);
    }
    if(buttonX==1 && buttonY==1){
        if(place_ball_time<0) place_ball_time=time;
    }
    if(status==1){
        for(var i=0;i<4;i++){
            for(var j=0;j<5;j++){
                if((posx-1580-i*90)*(posx-1580-i*90)+(posy-100-j*100)*(posy-100-j*100)<=1406 && chosen[10+i*5+j]==0){
                    status=2;
                    current_ball=10+i*5+j;
                    draw_marble(1580+i*90, 100+j*100, no[10+i*5+j], 2);
                    break;
                }
            }
        }
    }
}
function draw_maze(){
    for(var i=0;i<mapx;i++){
        for(var j=0;j<mapy;j++){
            for(var k=1;k<5;k++)
                if(!arr[i][j][k]) drawline(i,j,k,arr[i][j][0]);
        }
    }
    for(var i=0;i<mapx;i++){
        for(var j=0;j<mapy;j++){
            drawrect(i, j, arr[i][j][0]);
            for(var k=1;k<5;k++)
                if(arr[i][j][k]) drawline(i,j,k,"#000000");
        }
    }
}
function draw_button(){
    cv.beginPath();
    cv.rect(1540, 560, 460, 500);
    cv.fillStyle = "#eeeeee";
    cv.fill();
    if(posx>=1560 && posx<=1870 && posy>=570 && posy<=770 && buttonX==0){
        cv.beginPath();
        cv.rect(1575, 570, 290, 180);
        cv.fillStyle = button_color[buttonX][0];
        cv.fill();
        cv.beginPath();
        cv.rect(1580, 580, 275, 165);
        cv.fillStyle = button_color[buttonX][1];
        cv.fill();
        cv.font = '45pt Calibri bold';
        cv.fillStyle = "#000000";
        cv.fillText("X : "+randomX, 1620, 680);
    }else{
        cv.beginPath();
        cv.rect(1560, 570, 310, 200);
        cv.fillStyle = button_color[buttonX][2];
        cv.fill();
        cv.beginPath();
        cv.rect(1570, 590, 280, 170);
        cv.fillStyle = button_color[buttonX][3];
        cv.fill();
        cv.font = '50pt Calibri bold';
        cv.fillStyle = "#000000";
        cv.fillText("X : "+randomX, 1600, 700);
    }
    if(posx>=1560 && posx<=1870 && posy>=800 && posy<=1000 && buttonY==0){
        cv.beginPath();
        cv.rect(1575, 800, 290, 180);
        cv.fillStyle = button_color[buttonY][0];
        cv.fill();
        cv.beginPath();
        cv.rect(1580, 810, 275, 165);
        cv.fillStyle = button_color[buttonY][1];
        cv.fill();
        cv.font = '45pt Calibri bold';
        cv.fillStyle = "#000000";
        cv.fillText("Y : "+randomY, 1620, 910);
    }else{
        cv.beginPath();
        cv.rect(1560, 800, 310, 200);
        cv.fillStyle = button_color[buttonY][2];
        cv.fill();
        cv.beginPath();
        cv.rect(1570, 820, 280, 170);
        cv.fillStyle = button_color[buttonY][3];
        cv.fill();
        cv.font = '50pt Calibri bold';
        cv.fillStyle = "#000000";
        cv.fillText("Y : "+randomY, 1600, 930);
    }
}
function draw_background(){
    cv.beginPath();
    cv.rect(0, 0, 2000, 1040);
    cv.fillStyle = "#eeeeee";
    cv.fill();
}
function drawrect(x,y,color){
    cv.beginPath();
    cv.rect(x*size+21, y*size+21, size-2, size-2);
    cv.fillStyle = color;
    cv.fill();
}
function drawline(x,y,direction,color){
    cv.beginPath();
    cv.lineWidth = 2;
    if(direction==1){cv.moveTo(x*size+20, y*size+20);
        cv.lineTo((x+1)*size+20, y*size+20);}
    if(direction==2){cv.moveTo((x+1)*size+20, y*size+20);
        cv.lineTo((x+1)*size+20, (y+1)*size+20);}
    if(direction==3){cv.moveTo((x+1)*size+20, (y+1)*size+20);
        cv.lineTo(x*size+20, (y+1)*size+20);}
    if(direction==4){cv.moveTo(x*size+20, (y+1)*size+20);
        cv.lineTo(x*size+20, y*size+20);}
    cv.strokeStyle = "#000000";
    cv.stroke();
    cv.beginPath();
    cv.lineWidth = 2;
    if(direction==1){cv.moveTo(x*size+21, y*size+20);
        cv.lineTo((x+1)*size+19, y*size+20);}
    if(direction==2){cv.moveTo((x+1)*size+20, y*size+21);
        cv.lineTo((x+1)*size+20, (y+1)*size+19);}
    if(direction==3){cv.moveTo((x+1)*size+19, (y+1)*size+20);
        cv.lineTo(x*size+21, (y+1)*size+20);}
    if(direction==4){cv.moveTo(x*size+20, (y+1)*size+19);
        cv.lineTo(x*size+20, y*size+21);}
    cv.strokeStyle = color;
    cv.stroke();
}
function draw_marble(x,y,i,size){
    var color1="#ff9922", color2="#ffbb77";
    cv.beginPath();
    cv.arc(x, y, size*25, 0, 2 * Math.PI);
    cv.fillStyle="#000000";
    cv.fill();
    cv.beginPath();
    cv.arc(x, y, size*24, 0, 2 * Math.PI);
    cv.fillStyle=color1;
    cv.fill();
    cv.beginPath();
    cv.arc(x-size*3, y-size*3, size*20, 0, 2 * Math.PI);
    cv.fillStyle=color2;
    cv.fill();
    cv.beginPath();
    cv.arc(x-size*10*Math.cos(time/300), y-size*10*Math.sin(time/300), size*15, Math.max(0,(time)/200%(4*Math.PI)-2*Math.PI), Math.min(2*Math.PI,(time/200)%(4*Math.PI)));
    cv.fillStyle="rgba(255, 255, 150, 0.3)";
    cv.fill();
    cv.beginPath();
    cv.arc(x-size*15*Math.sin(time/200), y-size*15*Math.cos(time/200), size*10, (time)/200%(2*Math.PI), (time/200+Math.PI)%(2*Math.PI));
    cv.fillStyle="rgba(255, 255, 200, 0.2)";
    cv.fill();
    cv.beginPath();
    cv.arc(x-size*13*Math.sin(time/100), y-size*13*Math.cos(time/100), size*12, (time)/500%(2*Math.PI), (time/500+1.2*Math.PI)%(2*Math.PI));
    cv.fillStyle="rgba(255, 255, 250, 0.1)";
    cv.fill();
    cv.font = size*20 + 'pt Calibri bold';
    cv.fillStyle = "#000000";
    if(i<10){
        cv.fillText(i, x-size*8, y+size*10);
    }else{
        cv.fillText(i, x-size*15, y+size*10);
    }
}
document.addEventListener('keydown', function(event) {
    if(event.keyCode>=48 && event.keyCode<=57) {
        bfs_group(event.keyCode-48);
    }
});