import catchAsync from "../utils/catchAsync.js";
import Product from '../models/product.js';
export const getSearch = catchAsync(async (req, res, next) => {
  const {search,category} = req.query;
  let quer;
console.log('hello')
      // if(search || category){
      //   quer = await Product.find(
      //     { $text: { $search: search || category } },
      //     { score: { $meta: "textScore" } }
      //   ).sort({ score: { $meta: "textScore" } });
      // }

      
        if(search && category !== 'all'){
          const regex = new RegExp(search, "i");
          quer = await Product.find({
            $or: [
              { name: regex },
              { description: regex },
              { category: regex },
            ],
          });
        }
        if(!search && category !== 'all'){
          const categoryRegex = new RegExp(category, "i");
          quer = await Product.find({
            $or: [
              { name: categoryRegex },
              { description: categoryRegex },
              { category: categoryRegex },
            ],
          });
        }
        if(search && category !== 'all'){
          const regex = new RegExp(search, "i");
          const categoryRegex = new RegExp(category, "i");
          quer = await Product.find({
            $or: [
              { name: regex },
              { description: regex },
              { category: regex },
              { name: categoryRegex },
              { description: categoryRegex },
              { category: categoryRegex },
            ],
          });
        }
        if(search && category === 'all'){
          const regex = new RegExp(search, "i");
          quer = await Product.find({
            $or: [
              { name: regex },
              { description: regex },
              { category: regex },
            ],
          });
        }
        console.log(quer)
        
      if(!search && category === 'all'){
        quer = await Product.find().limit(30);
      }

  
  res.status(200).json({products:quer})
});
