const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken})
const { cloudinary } = require('../cloudinary');
module.exports.allCampgrounds = async(req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds : campgrounds});
}
module.exports.newCampground = (req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground = async(req,res,next)=>{
    // const geoData = await geocoder.forwardGeocode({
    //     query : req.body.campground.location,
    //     limit : 1
    // }).send()
    const campground = await new Campground(req.body.campground);
    // campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url : f.path , filename : f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','Successfully made a new campground..!');
    res.redirect('/camp');
}
module.exports.showCampground = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate({path : 'reviews' , populate :{path : 'author'}}).populate('author');
    if(!campground)
    {
        req.flash('error','Cannot find the campground..!');
        return res.redirect('/camp');
    }
    res.render('campgrounds/show',{campground : campground});
    console.log(campground.geometry.coordinates);
}
module.exports.editCampground = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground)
    {
        req.flash('error','Cannot find the campground..!');
        return res.redirect('/camp');
    }
    res.render('campgrounds/edit',{campground : campground});
}
module.exports.updateCampground = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
    const imgs = req.files.map(f => ({ url : f.path , filename : f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull : { images : { filename : { $in : req.body.deleteImages }}}})
    }
    req.flash('success','Successfully updated the campground..!');
    res.redirect(`/camp/${campground._id}`);
}
module.exports.deleteCampground = async(req,res,next)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground..!');
    res.redirect('/camp');
}