const fs = require("fs");
const axios = require("axios");

const downloadImage = async (url, folder) => {
  const res = await axios({
    url,
    method: "get",
    responseType: "stream",
  });

  const fileNameBlocks = url.split("/");
  const fileName = fileNameBlocks[fileNameBlocks.length - 1];

  res.data.pipe(fs.createWriteStream(`./${folder}/${fileName}`));
};

const apiURL =
  "https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020,ingenuity&feedtype=json&ver=1.2&num=100&page=....&&order=sol+desc&&&&extended=sample_type::full,product_id::ecv,";

const getPageImages = async (start, end, folder) => {
  for (let p = start; p < end; p++) {
    const apiRes = await axios.get(apiURL.replace("....", p));
    const data = apiRes.data;

    for (let i of data.images) {
      downloadImage(i.image_files.full_res, folder);
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

try {
  getPageImages(60, 80, "all");
} catch (e) {
  console.log(e);
}
