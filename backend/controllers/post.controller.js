import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"

// export const getposts = async (req, res) => {
//     const query = req.query;
//     console.log("query in controller",query);
//     try {
//       const posts = await prisma.post.findMany({
//         where: {
//           fromcity: query.fromcity || undefined,
//           tocity:query.tocity|| undefined,
//         //   type: query.type || undefined,
//         //   property: query.property || undefined,
//         //   bedroom: parseInt(query.bedroom) || undefined,
//           price: {
//             gte: parseInt(query.minPrice) || undefined,
//             lte: parseInt(query.maxPrice) || undefined,
//           },
//         },
//       });
//       console.log("printing query data",posts);
//       // setTimeout(() => {
//       res.status(200).json(posts);
//       // }, 3000);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Failed to get posts" });
//     }
//   };

//   export const getposts = async (req, res) => {
//     const query = req.query;
//     console.log("query in controller", query);
//     try {
//         let where = {};

//         if (query.fromcity) {
//             where.fromcity = query.fromcity.toString(); // Convert to string if needed
//         }
//         if (query.tocity) {
//             where.tocity = query.tocity.toString(); // Convert to string if needed
//         }
//         if (query.minPrice || query.maxPrice) {
//             where.price = {};
//             if (query.minPrice) {
//                 where.price.gte = parseInt(query.minPrice);
//             }
//             if (query.maxPrice) {
//                 where.price.lte = parseInt(query.maxPrice);
//             }
//         }

//         const posts = await prisma.post.findMany({
//             where: where,
//         });
//         console.log("printing query data", posts);
//         res.status(200).json(posts);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Failed to get posts" });
//     }
// };
export const getposts = async (req, res) => {
    const query = req.query;
    console.log("query in controller", query);
    try {
        const posts = await prisma.post.findMany({
            where: {
                fromcity: query.fromcity ? { equals: query.fromcity.toString() } : undefined,
                tocity: query.tocity ? { equals: query.tocity.toString() } : undefined,
                price: {
                                gte: parseInt(query.minPrice) || undefined,
                                lte: parseInt(query.maxPrice) || undefined,
                              },
            },
        });
        console.log("printing query data", posts);
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
};



export const getpost = async (req,res)=>{
    const id = req.params.id;
    try {
        const post =await prisma.post.findUnique({
            where:{ id },
            include:{
                postDetail:true,
                user:{
                    select:{
                        username:true,
                        avatar:true,
                    }
                },
            }
        })

        let userId;

        const token = req.cookies?.token;

        if(!token){
            userId = null;
        }else{
            jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
                if(err){
                    userId = null;
                }else{
                    userId = payload.id;
                }
            })
        }

        const saved = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    postId:id,
                    userId,
                }
            }
        })


        res.status(200).json({...post,isSaved :saved ? true :false })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to get one posts"})
    }
}

export const addpost = async (req,res)=>{
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newpost = await prisma.post.create({
            data:{
                ...body.postData,
                userId:tokenUserId,
                postDetail:{
                     create:body.postDetail,
                },
            },
        });
        res.status(200).json(newpost)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to add posts"})
    }
}



export const deletepost = async (req,res)=>{
    const id = req.params.id;
    const tokenUserid = req.userId;
    try {
       const post = await prisma.post.findUnique({
        where:{id}
       })
       
       if(post.userId !== tokenUserid){
        return res.status(403).json({message:"not authorized for delete post"})
       }

       await prisma.post.delete({
        where:{id},
       });

        res.status(200).json({message:" post delete successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to delete posts"})
    }
}


export const updatepost = async (req,res)=>{
    try {
        res.status(200).json({message:"update working"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to update posts"})
    }
}