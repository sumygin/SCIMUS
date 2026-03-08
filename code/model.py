from fastapi import FastAPI, HTTPException # server tools
from pydantic import BaseModel #handle requests 
import numpy as np #math

app = FastAPI()

global_lr = 0.025 #learning rate
target_c = 0.6 #target correctness value
cap = 10 #cap value for comments and collections

user_new_limit = 20
question_new_limit = 30

class interactionData(BaseModel): #data that is received from an interaction
    m: list[float]
    w: list[float]     
    s_i:float #user ability
    d: float #question difficulty
    user_interactions: int
    question_interactions: int

class recommendationData(BaseModel):
    s_i: float
    user_interactions: int

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def normalise_log(x, cap):
    return (np.log10(1+x))/(np.log10(1+cap))

@app.post("/api/interaction")
def interaction(data: interactionData):
    try:
        [m, w, s_i, d, u_i, q_i] = [data.m, data.w, data.s_i, data.d, data.user_interactions, data.question_interactions]
        #convert to arrays
        m = np.array(m)
        w = np.array(w) #HAS to be length 9

        lr = global_lr

        #check user + questions are new?
        if u_i < user_new_limit:
            lr*= 2
        if q_i < question_new_limit:
            lr*=2

        #NORMALISING MARKERS
        #w array: [rating, watch, solve, like, commentNum, collectionNum, viewDuration, skip]
        #difficulty rating
        if m[0] ==  0:
            m[0] = 2
        m[0]  = (m[0]-1)/4

        #like
        m[3] = (m[3]+1)/2

        #comments
        m[4] = normalise_log(m[4], 10)

        #collections
        m[5] = normalise_log(m[5], 10)

        #view duration
        m[6] = -normalise_log(m[6], 30)

        m = np.append(m, 1) #constant

        #inferred correctness value
        c_i = sigmoid(np.dot(m, w)) #dot product then sigmoid

        #expected correctness value
        c_e = sigmoid(s_i - d)

        #calculate delta and update weights
        delta = c_i - c_e
        delta_s_i = (lr*delta) #new user ability
        delta_d = (lr*delta) #new question diff
        delta_w = (lr*delta*m) #new weights

        #clip values to ranges
        new_w = w + delta_w
        new_w = np.clip(new_w, -3, 3)

        new_s = np.clip(s_i + delta_s_i, -4, 4)
        new_d = np.clip(d + delta_d, -4, 4)

        print("HELLO", delta)

        return {
            "status": "success",
            "s_i": (new_s - s_i),
            "d": (new_d - d),
            "w": (new_w - w).tolist()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/recommendation")
def recommendation(data: recommendationData):
    try:
        [s_i, u_i] = [data.s_i, data.user_interactions]
        
        d_T = s_i + np.log((1/target_c) - 1) #target question difficulty

        #define bands
        bands = {
            "regular": [d_T-0.5, d_T+0.5],
            "hard": [d_T+0.5, d_T+1],
            "easy": [d_T-1, d_T-0.5]
        }

        #check if user is new, scale bands accordingly
        if u_i < user_new_limit:
            for key in bands:
                bands[key][0] *= (2 / np.sqrt(u_i+1))
                bands[key][1] *= (2 / np.sqrt(u_i+1))
        
        return {
            "success":"true",
            "bands":bands
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))