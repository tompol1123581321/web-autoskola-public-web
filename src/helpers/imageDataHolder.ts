import imagage_0 from "../assets/0.jpeg"
import imagage_1 from "../assets/1.jpeg"
import imagage_2 from "../assets/2.jpeg"
import imagage_3 from "../assets/3.jpeg"
import imagage_4 from "../assets/4.jpg"
import imagage_5 from "../assets/5.jpeg"
import imagage_6 from "../assets/6.jpeg"
import imagage_7 from "../assets/7.jpeg"
import imagage_8 from "../assets/8.jpeg"
import imagage_9 from "../assets/9.jpeg"
import imagage_10 from "../assets/10.jpeg"
import imagage_11 from "../assets/11.jpeg"
import imagage_12 from "../assets/12.jpeg"
import imagage_13 from "../assets/13.jpeg"
import imagage_14 from "../assets/14.jpeg"
import type { GalleryImageDetail } from "../models"


export const IMAGE_DATA_HOLDER:Array<Omit<GalleryImageDetail,"src"> & {src:ImageMetadata}> = [
{id:0,alt:"",description:"",name:"",position:"first",src:imagage_0},
{id:1,alt:"",description:"",name:"",position:"mid",src:imagage_1},
{id:2,alt:"",description:"",name:"",position:"mid",src:imagage_2},
{id:3,alt:"",description:"",name:"",position:"mid",src:imagage_3},
{id:4,alt:"",description:"",name:"",position:"mid",src:imagage_4},
{id:5,alt:"",description:"",name:"",position:"mid",src:imagage_5},
{id:6,alt:"",description:"",name:"",position:"mid",src:imagage_6},
{id:7,alt:"",description:"",name:"",position:"mid",src:imagage_7},
{id:8,alt:"",description:"",name:"",position:"mid",src:imagage_8},
{id:9,alt:"",description:"",name:"",position:"mid",src:imagage_9},
{id:10,alt:"",description:"",name:"",position:"mid",src:imagage_10},
{id:11,alt:"",description:"",name:"",position:"mid",src:imagage_11},
{id:12,alt:"",description:"",name:"",position:"mid",src:imagage_12},
{id:13,alt:"",description:"",name:"",position:"mid",src:imagage_13},
{id:14,alt:"",description:"",name:"",position:"last",src:imagage_14},
]
