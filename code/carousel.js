let car = document.getElementsByClassName("car-content")[0]
let i = 0

function loop() {
    car.style.transform = `translateX(${i}px)`
    i+=1


    requestAnimationFrame(loop)
}



requestAnimationFrame(loop)