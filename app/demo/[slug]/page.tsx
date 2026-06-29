'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

// ═══════════════════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════
interface Service { name: string; desc: string; price: string }
interface Stat { value: string; label: string }
interface Review { name: string; rating: number; text: string; date: string }
interface IndustryConfig {
  name: string; tagline: string; headline: string; subheadline: string; about: string
  services: Service[]; stats: Stat[]; reviews: Review[]
  address: string; phone: string; email: string; hours: string
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE SYSTEM (Picsum — never breaks, never duplicates)
// Mỗi ngành được cấp 1 khối 10 ID riêng biệt -> KHÔNG THỂ trùng ảnh với ngành khác.
// hero = base+0, gallery = base+1..4, services = base+5..8
// ═══════════════════════════════════════════════════════════════════════════
function getIndustryImages(slug: string) {
  const imgs = INDUSTRY_IMAGES[slug] ?? INDUSTRY_IMAGES['nail-salon']
  return {
    hero: imgs[0],
    gallery: imgs.slice(1, 5),
    services: imgs.slice(5, 9),
    about: imgs[9] ?? imgs[1],
    galleryHero: imgs[10] ?? imgs[0],
  }
}

const INDUSTRY_IMAGES: Record<string, string[]> = {
  'nail-salon': [
    // [0] hero
    'https://pelicanhill.com/images/xr-laxnq-manicure-34619.jpg',
    // [1][2][3][4] gallery
    'https://www.jawspodiatry.com/wp-content/uploads/2019/02/AdobeStock_209766210-scaled.jpeg',
    'https://file.hstatic.net/200000532153/file/mornington_spa4053_print_resized_2560_height_f605ff07dc8841478c414e19b9bf1116_master.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/8wSbda9PfzeuKFrQLp7AcQ/1000s.jpg',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/c9/91/27/interior.jpg?w=1200&h=1200&s=1',
    // [5][6][7][8] services
    'https://thepinkissue.com/wp-content/uploads/2024/06/Milky-pink-nails-with-coquette-bows.jpg.webp',
    'https://i.redd.it/hjm17wficmi31.jpg',
    'https://i.pinimg.com/736x/11/e4/a9/11e4a935fc8d82b61a33c02164c44cc5.jpg',
    'https://img.magnific.com/free-photo/spa-treatment-product-female-feet-hand-spa-orchid-flowers-ceramic-bowl_1150-37718.jpg',
    // [9] about section (khác gallery[0])
    'https://nailedboutique.com/media/acfgallery/content/4/1/DSC00535_original.jpg',
    // [10] gallery hero (khác hero chính)
  'https://www.cdc.gov/niosh/media/images/2024/07/GettyImages-188077796.jpg',
  ],
  'beauty-salon': [
    'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg',
    'https://images.squarespace-cdn.com/content/v1/5fb13a5156ff4f3028e0a71b/a578054c-9fa9-4f98-92a0-f0540c7a535a/Twirl-Salon_San-Antonio_39_2500px.jpg?format=2500w',
    'https://images.fresha.com/locations/location-profile-images/41388/1976338/2807a197-2759-4774-a08a-a97015816c88-CharlieBeanSalon-AU-Victoria-Melbourne-Ormond-Fresha.jpg?class=venue-gallery-mobile&f_width=3840',
    'https://img.magnific.com/free-photo/female-hairdresser-using-hairbrush-hair-dryer_329181-1929.jpg?semt=ais_hybrid&w=740&q=80',
    'https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg',
    'https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg',
    'https://images.pexels.com/photos/3992878/pexels-photo-3992878.jpeg',
    'https://images.pexels.com/photos/3993451/pexels-photo-3993451.jpeg',
    'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
    'https://images.pexels.com/photos/3993452/pexels-photo-3993452.jpeg',
    'https://www.bizben.com/_next/image?url=https%3A%2F%2Fbizbenv3-prod.s3.us-east-1.amazonaws.com%2Fposts%2Fus-east-1%253Aaa0b5f56-b8c3-c2c4-a109-c2a715ff9a11%2Ftemp-1779300039017-d8bc9f61-c3a3-451f-8056-0dea3e34e09b%2Fthumbnail-1e4ced9a-e962-42db-a29a-df6db7aed870.jpg&w=1920&q=75',
  ],
  'spa': [
    'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg',
    'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg',
    'https://png.pngtree.com/background/20230714/original/pngtree-spa-woman-in-beauty-salon-facial-massage-relaxation-photo-picture-image_4224759.jpg',
    'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
    'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg',
    'https://tattvaspa.com/wp-content/uploads/2025/04/shutterstock_1285602291-scaled-1.jpg',
    'https://studio-elle.ca/wp-content/uploads/2022/10/studio-elle-hydrafacial.webp',
    'https://jacquelinemorgandayspa.com/wp-content/uploads/2025/03/Warm-Himalayan-Salt-JPG-saltability-scaled.jpg',
    'https://cdn.prod.website-files.com/5aef7a8b810a6fa0e3cc03cb/5b8eeefe8c638ad937ebcd85_Relaxation%20BG.jpg',
    'https://carlaspabali.com/admin-side/webfile/6950c16c9bcc6995f376b297f163175992961.jpg',
    'https://lashbrowuae.com/wp-content/uploads/2021/10/woman-with-mask-on-her-face-having-head-massage-1-1.jpg',
  ],
  'barbershop': [
    'https://www.guiadasemana.com.br/contentFiles/image/opt_w1024h1024/2017/02/FEA/49393_shutterstock-barbearia.jpg',
    'https://myntbarbershop.com/wp-content/uploads/2022/10/Mynt-Barbershop-Fort-Worth-Texas-V2-1024x757.jpg',
    'https://images.squarespace-cdn.com/content/v1/6499daf94cf67b3cc46ceb7c/1707314362886-7V2YD5ZYCK2XLNLEJS54/hot+towel+shave+dublin.jpg',
    'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg',
    'https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg',
    'https://img.magnific.com/free-photo/stylish-man-sitting-barbershop_1157-20487.jpg',
    'https://www.styleseat.com/blog/wp-content/uploads/2021/11/smiling-man-getting-a-hot-towel-shave-1.jpg',
    'https://thebeardclub.com/cdn/shop/articles/beard-shaping-thumb_da2a3100-e744-445b-908c-341a2a3b19ed_1200x630.png?v=1773332224',
    'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg',
    'https://images.squarespace-cdn.com/content/v1/67ab73d8c72b0b3112e60d7f/1739289561594-0NCL1Q930LCVP0HMX7T8/Statement-Barbershop-Interiors-197.jpg',
    'https://images.fresha.com/lead-images/placeholders/barbershop-59.jpg',
  ],
  'tattoo-studio': [
    'https://media.gq-magazine.co.uk/photos/64efb540271feab0f4bcdc0d/16:9/w_2560%2Cc_limit/1184219605',
    'https://www.epgdlaw.com/wp-content/uploads/2023/10/129400216_m_normal_none.jpg',
    'https://cdn1.matadornetwork.com/blogs/1/2012/05/Tattoo-artists-in-shop-with-client-tattooing-560x420.jpg',
    'https://images.pexels.com/photos/4125670/pexels-photo-4125670.jpeg',
    'https://www.blackarttattoo.in/tattoo/hero/best-tattoo-shop-udaipur-main.webp',
    'https://tattoohubstudio.uk/wp-content/uploads/2024/07/fine-line-tattoo-asche-tattoo-by-vatican-lounge-in-manchester-uk.jpg',
    'https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg',
    'https://preview.redd.it/rose-tattoo-coverup-v0-ja5koo4mxrod1.jpeg?auto=webp&s=42dcdbe3503f9c79919680c6a36d56e5ad6df197',
    'https://bangaloretattoos.com/wp-content/uploads/2024/06/GetPaidStock.com-665b1fbf33ff1-1024x683.jpg',
    'https://images.pexels.com/photos/7005656/pexels-photo-7005656.jpeg?h=1000&w=1500&fit=crop',
    'https://t4.ftcdn.net/jpg/05/08/61/45/360_F_508614566_pbb8CDKy6eK3ehCy0rgFh42OW2cOxPL5.jpg',
  ],
  'lash-studio': [
    'https://cdn.prod.website-files.com/6688bffc9ddc05c17697b61a/68a54602c25348572fad808f_Z_desktop_3_1024x1024.webp',
    'https://media.istockphoto.com/id/845708412/photo/eyelash-extension-procedure-woman-eye-with-long-eyelashes-lashes-close-up-macro-selective-focus.jpg?s=612x612&w=0&k=20&c=GRDESfELhTdQCItPCrs_sDbWs9sxxmilFhmJnK0FoIA=',
    'https://highfy.pk/cdn/shop/files/61tEAYowngL._AC_SL1500.jpg?v=1765464547&width=1946',
    'https://cdn.shopify.com/s/files/1/0621/3569/7621/files/5-min_d31a12cd-f28e-4902-a046-7aec8b1be917.jpg?v=1744018966',
    'https://blushrockbeauty.com/cdn/shop/articles/woman-eye-with-long-eyelashes-eyelash-extension-2025-01-29-04-36-23-utc.jpg?v=1754575164',
    'https://lostartistrylash.com/cdn/shop/files/classic_hybrid_volume_megavolumecomparison_76581d1e-93ee-474a-9c18-5bb862b74245.jpg?v=1754669974&width=1073',
    'https://www.thelashlounge.com/wp-content/uploads/2018/02/classic-and-volume-resized-blog-e1755888568907.jpg',
    'https://cdn.shopify.com/s/files/1/0486/0595/4197/files/snapinsta.app_440717702_2831415040347725_4483045777958362623_n_1080-1.jpg?v=1734806023',
    'https://s3-media0.fl.yelpcdn.com/bphoto/qAsXKU9Igo7nxz4dzM3Ejg/1000s.jpg',
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    'https://realtechniques.com/cdn/shop/files/B0DKLMZLJS.PT04_1024x1024.jpg?v=1734032258',
  ],
  'makeup-artist': [
    'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg',
    'https://creatorsmag.com/cdn/shop/articles/Moya_720x.jpeg?v=1576014715',
    'https://static.wixstatic.com/media/681664_98c01b426dbe4904b291a52a57dde249~mv2.jpeg/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/681664_98c01b426dbe4904b291a52a57dde249~mv2.jpeg',
    'https://www.mbmmakeupstudio.com/wp-content/uploads/2021/06/best-makeup-artist.jpg',
    'https://www.cortiva.edu/wp-content/uploads/sites/2/2024/03/35b469_11d0ffe8067642bd87eac9c2c5e082f1mv2.webp',
    'https://hips.hearstapps.com/hmg-prod/images/766/weddin-makeup-questions-main-1516887058.jpg?resize=640:*',
    'https://mnbeautystudio.com/wp-content/uploads/2023/05/mn_makup-683x1024.jpg',
    'https://static1.squarespace.com/static/57ae20feb3db2b8d0ea60c60/t/5ac0763e88251bcf7a32b221/1522562662716/Hawa3.jpg?format=1500w',
    'https://static.wixstatic.com/media/806960_31a2a772eb0948b1bc62b0491472ac0b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/806960_31a2a772eb0948b1bc62b0491472ac0b~mv2.jpg',
    'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
    'https://lmi.edu/wp-content/uploads/2022/02/shutterstock_525728962.jpg',
  ],
  'florist': [
    'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
    'https://noirboutiqueuae.com/products/vase-blue-tulips.jpg',
    'https://static.wixstatic.com/media/b78f79_62a3fd3e5eef4c799ca1b2b345271997~mv2.jpg/v1/fill/w_560,h_654,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b78f79_62a3fd3e5eef4c799ca1b2b345271997~mv2.jpg',
    'https://www.flowersbyflourish.com/wp-content/uploads/2018/04/IMG_1111.jpg',
    'https://images.pexels.com/photos/931180/pexels-photo-931180.jpeg',
    'https://images.squarespace-cdn.com/content/v1/6505efa7e66f2a3d16600892/7277fd78-f36c-4f97-9694-7d4e2ea56870/E1065173-CB14-40A2-B610-890F388C513E.PNG?format=1000w',
    'https://angela-flower.com/cdn/shop/files/O1CN01XAwcxv2K0JDfcJl08__33129494.jpg?v=1720681730&width=900',
    'https://www.flowersbyflourish.com/wp-content/uploads/2020/06/%C2%A340.00-Autumnal-Office-Flowers-scaled.jpg',
    'https://images.squarespace-cdn.com/content/v1/60454d15cf5af74e6a6c1d35/1693951939303-E1GLWHDHFY549J9OBEJL/374763497_714575077352584_1225461181647707183_n.jpg?format=1500w',
    'https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/144560738Florist.jpg=ws1280x960',
    'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
  ],
  'jewellery': [
    'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg',
    'https://www.diamondsfactory.ie/catalog/view/theme/default/image/information/bespoke-banner-desktop.png',
    'https://honourjewellery.co.uk/wp-content/uploads/2026/02/Flower-banner-crop.jpg',
    'https://t3.ftcdn.net/jpg/01/80/95/54/360_F_180955484_2gqku5oFKA23Kh0gAC8oNM3y61xz0o9t.jpg',
    'https://static.vecteezy.com/system/resources/thumbnails/042/101/869/small/ai-generated-jewelry-diamond-ring-on-wooden-table-with-bokeh-background-ai-generative-free-photo.jpeg',
    'https://www.hellodiamonds.com/blog/upload/blog/1725951220_post_image.jpg',
    'https://www.michelijewellery.com.au/cdn/shop/files/DSC09040-Edit-Edit-1-2.jpg?v=1742696279&width=1024',
    'https://www.mariatash.com/cdn/shop/files/mt_vom_215_sizing_reference_2_2.png?v=1748859237&width=1445',
    'https://cdn.shopify.com/s/files/1/0830/1871/1325/files/1200X1200_Fine_Jewelry_Repair_Tools.webp?v=1757079458',
    'https://silvermerc.com/cdn/shop/files/SBJS3MD_348_2.jpg?v=1715061321&width=533',
    'https://my-live-01.slatic.net/p/67d0ddb3560fe329f74cabd93982514e.jpg',
  ],
  'boutique-clothing': [
    'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    'https://capsulewardrobecollection.com/wp-content/uploads/2020/02/ZV5A1879-96-dpi.jpg',
    'https://hoianese.com/wp-content/uploads/2024/05/image-5-min-1024x683.png',
    'https://www.insidehook.com/wp-content/uploads/2024/05/N8A8407-1.jpg?fit=1200%2C800',
    'https://static.wixstatic.com/media/84e964_1173ec812f35452d8cd968ea8e039567~mv2.jpg/v1/fill/w_640,h_614,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/84e964_1173ec812f35452d8cd968ea8e039567~mv2.jpg',
    'https://blog.clover.com/wp-content/uploads/2024/08/stylist-helping-customer-select-outfit.jpg',
    'https://hoianese.com/wp-content/uploads/2024/05/image-3-min-1024x683.png',
    'https://static.wixstatic.com/media/4f6225_12378f61b87145ab9f6262f331b088b3~mv2.jpg/v1/fill/w_980,h_654,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4f6225_12378f61b87145ab9f6262f331b088b3~mv2.jpg',
    'https://angelinabelle.com/cdn/shop/files/vip-elite-style-club-membership-angelina-belle-boutique-832.jpg?crop=center&height=1200&v=1726857383&width=1200',
    'https://brooklynboulevard.com/cdn/shop/files/BrooklynBoulevardWebsiteShootFinals-88.jpg?v=1777156037&width=5472',
    'https://www.josephineeve.com/images/wardrobe-image2.webp',
  ],
  'clothing': [
    'https://kaasida.com/cdn/shop/files/hand-embroidered_clothing_for_women.jpg?v=1710567552&width=3840',
    'https://www.goinginstyle.com/cdn/shop/collections/woman-stands-in-her-store-with-folded-arms-clothing-store.jpg?v=1724441628',
    'https://rangeboutique.com/cdn/shop/articles/Top_Reasons_to_Shop_at_a_Women_s_Online_Boutique_vs._Big_Retail_Stores_12487db9-b3e7-477e-ba72-85e3add2bf89-4750865.jpg?v=1762207054&width=1200',
    'https://sa.kapamilya.com/absnews/abscbnnews/media/2019/advertorial/09/04/20190904_comfort.jpg',
    'https://thumbs.dreamstime.com/b/seasonal-shopping-concept-black-female-choosing-clothes-rack-following-latest-fashion-trends-orange-background-african-430812236.jpg',
    'https://m.media-amazon.com/images/I/61pBqB02l1L._AC_UY1000_.jpg',
    'https://i0.wp.com/sarah-tucker.com/wp-content/uploads/2024/08/Fall-Capsule-Wardrobe-2024-1.png?fit=1000%2C1500&ssl=1',
    'https://www.walkingapron.com/cdn/shop/files/il_fullxfull.4545643995_qopy.jpg?v=1723517671&width=2244',
    'https://seattlerefined.com/resources/media2/16x9/full/1015/center/80/6f8bd0b5-67a0-498f-818f-90a85d30166c-large16x9_UnboxingImage.jpg',
    'https://offloadmedia.feverup.com/cdmxsecreta.com/wp-content/uploads/2025/01/23111040/centros-comerciales-cdmx-1024x683.jpg',
    'https://www.newbalance.com.au/dw/image/v2/AASX_PRD/on/demandware.static/-/Library-Sites-NBAU-NBNZ/default/dw7b0ba772/test-comp-images/2026_Comp_Assets/NB-7280_MenClothing_Hoodies_Image3.jpg?sw=991&sfrm=jpg',
  ],
  'dental': [
    'https://www.dentevim.com/upload/ortodontik-tedavi-su-resince-dis-bakiminda-nelere-dikkat-edilmeli.jpg',
    'https://i0.wp.com/asianheartinstitute.org/wp-content/uploads/2024/10/Factors-To-Consider-While-Choosing-A-Dentist.jpg?fit=1572%2C917&ssl=1',
    'https://surecellbd.com/wp-content/uploads/2023/08/laser-dental.jpg',
    'https://www.mysmiledoctors.com.au/wp-content/uploads/2020/11/107047615_dentist2.jpg',
    'https://images.pexels.com/photos/3845749/pexels-photo-3845749.jpeg',
    'https://media.post.rvohealth.io/wp-content/uploads/2020/11/dentist-1200x628-facebook-1200x628.jpg',
    'https://www.natrusmile.com/cdn/shop/articles/laser-teeth-whitening-vs-bleaching.png?v=1674147736',
    'https://www.momentdental.com/wp-content/uploads/2025/02/Invisalign-Treatment_-What-to-Expect-During-Your-First-Consultation.jpg',
    'https://nhakhoatamducsmile.com/en/wp-content/uploads/2026/01/porcelain-veneers-2.jpg',
    'https://surecellbd.com/wp-content/uploads/2023/08/laser-dental.jpg',
    'https://surecellbd.com/wp-content/uploads/2023/08/laser-dental.jpg',
  ],
  'medical': [
    'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    'https://medivision.in/uploaded_files/blog/2148396685_1735638206.jpg',
    'https://lbtuk.b-cdn.net/GPConsultation/london-blood-tests-gp-consultation-near-me.jpg',
    'https://www.keckmedicine.org/wp-content/uploads/2021/11/Medical-doctors-and-nurse-practitioners-discuss-paperwork-in-a-hallway.jpg',
    'https://images.pexels.com/photos/4386475/pexels-photo-4386475.jpeg',
    'https://scclittleelm.com/blogs/wp-content/uploads/2025/06/19324.jpg',
    'https://myknee.trekeducation.org/wp-content/uploads/sites/14/2022/01/CDMP-process-1024x724.png',
    'https://em43b5nv8i5.exactdn.com/wp-content/uploads/2024/03/telehealth_1.jpg?strip=all',
    'https://www.biomedphnompenh.com/uploads/large_general_health_check_up_3_484edb21c3.jpg',
    'https://images.pexels.com/photos/4386469/pexels-photo-4386469.jpeg',
    'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg',
  ],
  'veterinary': [
    'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg',
    'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg',
    'https://mixlab.com/hubfs/shutterstock_2485692303.jpg',
    'https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2019/03/Women-in-Vteerinary-Medicine-History.jpg',
    'https://images.pexels.com/photos/6235239/pexels-photo-6235239.jpeg',
    'https://images.pexels.com/photos/6235241/pexels-photo-6235241.jpeg',
    'https://images.pexels.com/photos/6235243/pexels-photo-6235243.jpeg',
    'https://taradalevet.co.nz/wp-content/uploads/sites/72/2023/09/desexing-your-pet-6-1024x546.jpg',
    'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg',
    'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg',
    'https://images.pexels.com/photos/6235235/pexels-photo-6235235.jpeg',
  ],
  'pharmacy': [
    'https://deshbhagatuniversity.in/wp-content/uploads/2024/07/7087.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Man_consults_with_pharmacist_%282%29.jpg/1280px-Man_consults_with_pharmacist_%282%29.jpg',
    'https://bouve.northeastern.edu/wp-content/uploads/2023/05/pharmacists-career-options-northeastern-graduate.webp',
    'https://i.cbc.ca/ais/1.7186170,1714149008000/full/max/0/default.jpg?im=Crop%2Crect%3D%280%2C0%2C4032%2C2268%29%3B',
    'https://greelypharmasave.com/wp-content/uploads/2017/12/medication-reviews.jpg',
    'https://www.pharmarise.com.my/wp-content/uploads/2025/01/female-client-standing-near-pharmacy-counter-1024x681.jpg',
    'https://noraapothecary.com/wp-content/uploads/2015/10/custom-compounding.jpg',
    'https://static01.nyt.com/images/2022/10/18/well/11WELL-FLU-SHOT-EXPLAINER1/11WELL-FLU-SHOT-EXPLAINER1-videoSixteenByNine3000.jpg',
    'https://hayesbartonpharmacy.com/wp-content/uploads/2015/05/12_MedReview_Counseling_IMAGE.jpg',
    'https://greelypharmasave.com/wp-content/uploads/2017/12/medication-reviews.jpg',
    'https://greelypharmasave.com/wp-content/uploads/2017/12/medication-reviews.jpg',
  ],
  'chiropractor': [
    'https://storage.googleapis.com/treatspace-prod-media/pracimg/u-70/shutterstock_1793070016.jpeg',
    'https://theadvancedspinecenter.com/wp-content/uploads/2019/06/chiropractor-2.png',
    'https://cdn.prod.website-files.com/699f3b8f83694da1acba736b/69a749762fddd5bbec67f575_Chiropractic-.jpeg',
    'https://cdn-ildgdeb.nitrocdn.com/VTvNvKKSPCHpAxHKuEawGXtMFimQISYT/assets/images/optimized/rev-9b3f378/bodytonicclinic.co.uk/wp-content/uploads/2024/09/Chiropractor-1-scaled.jpg',
    'https://images.pexels.com/photos/3760283/pexels-photo-3760283.jpeg',
    'https://static.wixstatic.com/media/8000cc_77dc515925ec42e98a81cbd43d5840d6~mv2.jpg/v1/fill/w_670,h_446,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8000cc_77dc515925ec42e98a81cbd43d5840d6~mv2.jpg',
    'https://www.texasmedicalinstitute.com/wp-content/uploads/sites/456/2024/06/Chiropractic-Adjustments-Texas-Medical-Institute-Dallas.jpg',
    'https://gonsteadchiropractic-sd.com/wp-content/uploads/2025/09/Patient-receiving-posture-adjustment-for-rounded-shoulders.webp',
    'https://images.pexels.com/photos/3760275/pexels-photo-3760275.jpeg',
    'https://images.pexels.com/photos/3760277/pexels-photo-3760277.jpeg',
    'https://images.pexels.com/photos/3760279/pexels-photo-3760279.jpeg',
  ],
  'physio': [
    'https://enrichphysio.com.au/wp-content/uploads/2022/06/How-your-physio-can-help-with-joint-pain.jpg',
    'https://images.pexels.com/photos/5473179/pexels-photo-5473179.jpeg',
    'https://portlandwellnesscare.com/wp-content/uploads/2022/08/how-effective-is-physiotherapy.jpg',
    'https://i0.wp.com/painproclinics.com/wp-content/uploads/2022/03/painPRO-Feb-1.jpg?resize=1080%2C727&ssl=1',
    'https://images.pexels.com/photos/5473185/pexels-photo-5473185.jpeg',
    'https://static.wixstatic.com/media/bb77fc2fe030430f857da1816717a534.jpg/v1/fill/w_1000,h_668,al_c,q_85,usm_0.66_1.00_0.01/bb77fc2fe030430f857da1816717a534.jpg',
    'https://www.drsarwarphysiotherapycenter.com/wp-content/uploads/2020/01/physiotherapist-in-Dwarka.jpg',
    'https://cdn.prod.website-files.com/60d3395d60e9503a507bae32/60ffe9f9246c10be5c34a610_Sports%20Injury.webp',
    'https://www.physioex.co.uk/wp-content/uploads/2021/07/Pre-and-post-op-july-2021-1024x682.jpg',
    'https://images.pexels.com/photos/5473179/pexels-photo-5473179.jpeg',
    'https://images.pexels.com/photos/5473181/pexels-photo-5473181.jpeg',
  ],
  'optometrist': [
    'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg',
    'https://i0.wp.com/newyorkstyleoptometry.com/wp-content/uploads/2025/04/66f1e91cb841ec605cbbaf0e.webp?fit=800%2C534&ssl=1',
    'https://perrymed.com/wp-content/uploads/2025/04/What-is-the-difference-between-an-optometrist-and-an-ophthalmologist.webp',
    'https://theeyeavenue.com/wp-content/uploads/2023/11/Whats-the-Difference-Between-an-Optician-Optometrist-and-an-Ophthalmologist-Hero-1.jpg',
    'https://images.pexels.com/photos/5765835/pexels-photo-5765835.jpeg',
    'https://eyelaboptometry.com/wp-content/uploads/2025/08/What-is-a-Comprehensive-Eye-Exam-hero-2-1024x672.jpg',
    'https://arenaeyeworks.com/wp-content/uploads/2022/11/glasses-fitting-1024x672.jpg',
    'https://europeaneyecenter.com/wp-content/uploads/2023/08/contact-lens-fitting-1-.jpg',
    'https://images.squarespace-cdn.com/content/v1/618bf88dbe6a742ab7ed33e6/275dcee2-f0c0-4157-bbf8-0a41e25fffd7/A7408526-min.jpg',
    'https://images.pexels.com/photos/5765829/pexels-photo-5765829.jpeg',
    'https://images.pexels.com/photos/5765831/pexels-photo-5765831.jpeg',
  ],
  'restaurant': [
    'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    'https://www.rewardsnetwork.com/wp-content/uploads/2016/02/Tasting-Menus.jpg',
    'https://cdn.shopify.com/s/files/1/0419/7151/5551/t/3/assets/7-1633456657386.jpg?v=1633456658',
    'https://pastaevangelists.com/cdn/shop/files/image_28.png?v=1764681646&width=1920',
    'https://fincarosablanca.com/uploads/seasonal-tasting-menu-at-El-Tigre-Vestido-min.jpeg',
    'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
  ],
  'cafe': [
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    'https://cdn.xanhsm.com/2025/02/13cba011-cafe-sang-sai-gon-4.jpg',
    'https://texascoffeeschool.com/wp-content/uploads/2021/10/DSC_0052-scaled.jpg',
    'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
    'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg',
    'https://balancecoffee.co.uk/cdn/shop/articles/hario-v60-coffee_be9809ce-40a6-4698-bb3a-6df2c75f7f08.jpg?v=1761773861',
    'https://homecoffeeexpert.com/wp-content/uploads/2023/10/Cortado-and-Flat-White.jpg',
    'https://realfood.tesco.com/media/images/1400X919-SMASHED-AVOCADO-ON-TOAST-BEST-023d08cc-576e-4b15-81f2-e5d30cd745a1-0-1400x919.jpg',
    'https://mickeyblog.com/wp-content/uploads/2025/06/2025-wdw-disney-world-disneys-animal-kingdom-satuli-canteen-specialty-cold-brew-flight-joffreys-matcha-ube-23.jpg',
    'https://images.pexels.com/photos/1990903/pexels-photo-1990903.jpeg',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
  ],
  'bakery': [
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
    'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
    'https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg',
    'https://chez-christophe.ca/cdn/shop/files/specialty-pastry-fresh-fruit-danish-metro-vancouver-pain-suisse-from-top-rated-bakery-chez-christophe-in-burnaby-and-white-rock-bc_1000x1000.jpg?v=1732593863',
    'https://content.jdmagicbox.com/v2/comp/mumbai/x2/022pxx22.xx22.211207135618.i3x2/catalogue/little-hearts-bakers-shahapur-mumbai-cake-shops-iwdmvkne4r.jpg',
    'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/classic_sourdough_21029_16x9.jpg',
    'https://images.ricardocuisine.com/services/recipes/croissant1.jpg',
    'https://www.britishbakels.co.uk/wp-content/uploads/sites/2/2022/01/Bakels_147-Large.jpg',
    'https://swirlcakes.ca/wp-content/uploads/elementor/thumbs/IMG_7796-1-scaled-qsk2ehmvw1uizv24vkxzupi2cvaasua5y8k08rt9n4.jpg',
    'https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg',
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
  ],
  'food-truck': [
    'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg',
    'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
    'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
    'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg',
    'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg',
    'https://wraprollit.com.au/wp-content/uploads/2025/11/Food-Crispy-Pork-Bao.jpg',
    'https://pbs.twimg.com/media/FnZ1ztdXkAAHV1J.jpg',
    'https://media.hellofresh.com/q_100,w_3840,f_auto,c_limit,fl_lossy/recipes/image/HF_Y24_R22_W25_IE_IESC22640-3_Main_f1high-920f44a3.jpg',
    'https://www.siftandsimmer.com/wp-content/uploads/2021/04/matcha-pandan-latte3.jpg',
    'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
    'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg',
  ],
  'wine-bar': [
    'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg',
    'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg',
    'https://images.squarespace-cdn.com/content/v1/6833df5d52663f7b535c2f91/1748840303984-QJG4MWUW9BJGEWE19Y1G/wine-tasting-sniff.jpg?format=1500w',
    'https://www.christchurchnz.com/_image?href=https%3A%2F%2Fa-ap.storyblok.com%2Ff%2F3000820%2F2400x1601%2F38101197f0%2Fglasses_of_wine_with_platter.jpg%2Fm%2F1280x720%2Fsmart%2Ffilters%3Aquality%2890%29&w=1280&h=720&f=webp',
    'https://shop.crescent-hotel.com/cdn/shop/products/CHARCUTERIEBOARDWREDWINE_3937x.jpg?v=1654099234',
    'https://images.squarespace-cdn.com/content/v1/59405ecbbf629a891ef428cf/cee6daa0-5e06-4d47-b349-dfd880469774/DSC04735+%281%29.png?format=2500w',
    'https://images.pexels.com/photos/1407847/pexels-photo-1407847.jpeg',
    'https://www.thehealthytoast.com/wp-content/uploads/2019/07/Simple-tomato-and-burrata-salad.jpg',
    'https://www.shopcuvee.com/cdn/shop/files/thenaturalwinesubscription_56e7a0ff-838d-4266-a94a-86b39e821bfd.png?v=1731687684',
    'https://images.pexels.com/photos/2702807/pexels-photo-2702807.jpeg',
    'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg',
  ],
  'sushi-restaurant': [
    'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    'https://www.tasteandtellmnl.com/cdn/shop/products/UntitledSession1311_2048x.jpg?v=1742360774',
    'https://images.pexels.com/photos/2098086/pexels-photo-2098086.jpeg',
    'https://cdn.shopify.com/s/files/1/1083/2612/files/omakase1_480x480.jpg?v=1746070885',
    'https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg',
    'https://blog.resy.com/wp-content/uploads/2023/05/Himitsu-1-2000x1125.jpg',
    'https://img.freepik.com/premium-photo/sushi-set-with-variety-rolls-nigiri-lying-green-leaves_711700-25374.jpg',
    'https://d28dpoj42hxr8c.cloudfront.net/files/user/201803091609_12.jpg?v=1520579395',
    'https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/vlysazxr/84dd326c-4b3c-4108-9869-31bdc25fa850.jpeg',
    'https://images.pexels.com/photos/2098088/pexels-photo-2098088.jpeg',
    'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
  ],
  'ice-cream-shop': [
    'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg',
    'https://i0.wp.com/cookingitalians.com/wp-content/uploads/2024/07/img-RDN4ZfjtP5hB22jQgDlEB.jpeg?fit=1536%2C1536&ssl=1',
    'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg',
    'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg',
    'https://funcakes.com/content/uploads/2023/06/Ice-cream-recipe-960x960-c-default.jpg',
    'https://blog.italotreno.com/wp-content/uploads/2024/08/gelato.jpg',
    'https://www.recipetineats.com/uploads/2023/06/Affogato_0.jpg',
    'https://i5.walmartimages.com/asr/e3e6ad37-8dbc-419d-a19f-7bfcf6189507.ba5e26a4b7b6d1ee566582d7bb07610d.jpeg',
    'https://www.dorogc.com/wp-content/uploads/2020/08/gelato-cake-3-768x512.jpg',
    'https://images.pexels.com/photos/1362539/pexels-photo-1362539.jpeg',
    'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg',
  ],
  'pet-shop': [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    'https://cdn.prod.website-files.com/66d20f6608a233fad85356da/693decad1e80427297a74895_81e391598422cd060489d13693fbd183635a300a.jpeg',
    'https://www.fearfree.com/wp-content/uploads/2024/08/GROOMING-STRENGTHENS-RELATIONSHIPS.png',
    'https://images.ctfassets.net/rt5zmd3ipxai/7LYPSb3aRh75SPnwRpJKeu/f4b549d3f931466b14cb47e7807ad380/NVA_-_PetSuites_-MASTER-_-_Grooming_-_Why_Us.jpg?fit=fill&fm=webp&h=480&w=782&q=72,%20https://images.ctfassets.net/rt5zmd3ipxai/7LYPSb3aRh75SPnwRpJKeu/f4b549d3f931466b14cb47e7807ad380/NVA_-_PetSuites_-MASTER-_-_Grooming_-_Why_Us.jpg?fit=fill&fm=webp&h=960&w=1564&q=72',
    'https://images.destpet.com/is/image/destpet/thumbnail_image25?ts=1744876810686&dpr=off',
    'https://i.pinimg.com/736x/e9/2f/79/e92f79a27bdd257a5b98eb40b431d8ec.jpg',
    'https://deax38zvkau9d.cloudfront.net/prod/assets/images/uploads/services/1685618253pet-grooming-dubai.webp?f=webp&w=768',
    'https://shop.puppyspot.com/cdn/shop/files/image_11.png?v=1765302953',
    'https://cdn.thewirecutter.com/wp-content/uploads/2019/08/petsubscriptionboxes-lowres-2x1-3878.jpg?width=2048&quality=75&crop=2:1&auto=webp',
    'https://cdn.prod.website-files.com/66d20f6608a233fad85356da/693decad1e80427297a74895_81e391598422cd060489d13693fbd183635a300a.jpeg',
    'https://cdn.prod.website-files.com/66d20f6608a233fad85356da/693decad1e80427297a74895_81e391598422cd060489d13693fbd183635a300a.jpeg',
  ],
  'bookshop': [
    'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
    'https://librarydisplays.org/wp-content/uploads/2019/04/little2-1.jpg?w=720',
    'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg',
    'https://news.wagga.nsw.gov.au/__data/assets/image/0004/168385/varieties/centre1200.jpg',
    'https://images.pexels.com/photos/1370297/pexels-photo-1370297.jpeg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKVpY13_CbQveL5I5qXhVju2LQ7Gv3mqVcg8C8_sM_nWs0JglT1gTzUMAG7qjIf6B4k1qbWMu3ZaRbHoM2VpKXE-sceNRRp1A1x7xwwVXQ90HempukJbd25jM5B6J76_wrp6JalUmuRAAx5tCcEnmiI98IjUAiCkVBo9ph5oGuk_POovQE8AIC98NuaQ/s1800/3C7DCCC7-5E80-46DD-BC56-3ECE8F030842.JPG',
    'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
    'https://images.pexels.com/photos/256453/pexels-photo-256453.jpeg',
    'https://yoyoandflo.com/cdn/shop/products/1657798207.png?v=1657798208',
    'https://images.pexels.com/photos/256454/pexels-photo-256454.jpeg',
    'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
  ],
  'gym': [
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
    'https://blog.nasm.org/hubfs/nasm_ttedig_nd15_groupft_1208x808.jpg',
    'https://media.istockphoto.com/id/2027278927/photo/young-athletic-woman-exercising-with-barbell-during-sports-training-in-a-gym.jpg?s=612x612&w=0&k=20&c=ifFL7Mqc8NwTj25PAx4ONy1OOQZvc1S_kVOofsbLgFw=',
    'https://media.istockphoto.com/id/2075354173/photo/fitness-couple-is-doing-kettlebell-twist-in-a-gym-togehter.jpg?s=612x612&w=0&k=20&c=lfs1V1d0YB33tn72myi6FElJnylPJYYM9lW5ZhlnYqY=',
    'https://levelfyc.com/wp-content/uploads/2024/08/phong-tap-gym-cho-nam-tai-ha-noi-2.jpg',
    'https://www.vidafitness.com.au/wp-content/uploads/2026/05/Vida-Fitness-Bulleen-500-x-500-1.jpg',
    'https://blog.nasm.org/hubfs/small-group-training-blog.jpg',
    'https://www.shutterstock.com/image-photo/fitness-coach-doing-individual-training-600nw-2674439905.jpg',
    'https://maplecryotherapy.com/wp-content/uploads/2021/05/bodyScanner.jpg',
    'https://images.pexels.com/photos/1552261/pexels-photo-1552261.jpeg',
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
  ],
  'yoga-studio': [
    'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg',
    'https://yogaspotaz.com/wp-content/uploads/D62_0803-1024x681.jpg',
    'https://prodapilymberfitness.mindbodyonline.com/studios/182195/gallery_images/1234381/cropped_yogaflow_20160520_0601_%281%29.jpg?1703958230',
    'https://loveyogaleeds.com/wp-content/uploads/2025/06/LoveYoga-258-768x512.jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/1400/3c9c68180540055.650c4944a529c.jpg',
    'https://trifitla.com/wp-content/uploads/2025/01/yoga.jpg',
    'https://i0.wp.com/soulsweatyoga.com/wp-content/uploads/2020/11/Screen-Shot-2020-11-10-at-11.17.19-AM.png?resize=1170%2C780&ssl=1',
    'https://images.squarespace-cdn.com/content/v1/62d2cbdefaae4a34a4496cc6/d9329be4-4363-4858-b207-6b763749fc54/Brandbot+Images+%284%29.jpg',
    'https://img.freepik.com/free-photo/fit-young-women-training-together_23-2148430210.jpg?semt=ais_rp_progressive&w=740&q=80',
    'https://images.pexels.com/photos/3822910/pexels-photo-3822910.jpeg',
    'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg',
  ],
  'personal-trainer': [
    'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg',
    'https://www.personaltraineredu.org/wp-content/uploads/2022/11/personal-trainer.jpg',
    'https://carbonperformance.com/wp-content/uploads/2024/07/shutterstock_2249557387.jpg',
    'https://images.pexels.com/photos/4162490/pexels-photo-4162490.jpeg',
    'https://communityed.vvc.edu/common/images/2/22846/GES1024ACE-Personal-Trainer935x572.jpg',
    'https://urec.uark.edu/_resources/images/fitness_wellness/personal-trainer-1-compressor.jpg',
    'https://bustamovepersonaltraining.com/busta3/wp-content/uploads/2019/11/1-on-1a.jpg',
    'https://athomefitness.co.uk/wp-content/uploads/2023/11/Landscape-Katie-Lees-Client-trainer-Equipment-86.jpg',
    'https://res.cloudinary.com/dvjfemxbz/image/upload/nasm_certified_personal_trainer_holds_apple_and_donut_client_points_snacks_on_table_gym_backdrop._personal_trainer_and_nutrition_coach_ez4o6i.png',
    'https://images.pexels.com/photos/4162496/pexels-photo-4162496.jpeg',
    'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg',
  ],
  'pilates': [
    'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
    'https://images.pexels.com/photos/4056536/pexels-photo-4056536.jpeg',
    'https://www.pilates.com/static/0935703bbe318efb56b8e22d51f18f43/8ba9f/1909_ReformerAllegro_0046-Edit.jpg',
    'https://cdn.shopify.com/s/files/1/0539/1476/3457/products/product06_49e51f00-afa0-47ba-a5e6-302855242f56_1720x1228_crop_center.jpg?v=1740516646',
    'https://pilatesdanang.vn/wp-content/uploads/2024/08/pilates-va-giai-phap-giam-dau-lung-66b1acd2b68b0.webp',
    'https://ffc.com/wp-content/uploads/2018/03/Untitled-design-3.jpg',
    'https://trimetricsphysio.com/wp-content/uploads/2023/03/Clinical-Pilates-North-Vancouver.jpg',
    'https://d357mttm70bw7x.cloudfront.net/d7d2b2ad-5d78-4269-a7e0-e354c5b70f7a.jpg',
    'https://static.wixstatic.com/media/15d9ac_edea342f9a35411eaa47266ba67afda8~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/15d9ac_edea342f9a35411eaa47266ba67afda8~mv2.png',
    'https://images.pexels.com/photos/4056544/pexels-photo-4056544.jpeg',
    'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
  ],
  'martial-arts': [
    'https://cdn.prod.website-files.com/67b75a5f98a3dca8348c674d/67bb7ac0295cefc281bd2c67_Kids%20Confidence%20at%20Complete%20Control%20in%20Adelaide%20SA%20desktop.webp',
    'https://teamm1.com/wp-content/uploads/kickboxing-gym-11-1080x658.jpg',
    'https://punchitgym.com/wp-content/uploads/2023/07/Muay-Thai-for-all-for-fun-and-better-general-fitness-01.jpg',
    'https://www.krankbrooklyn.com/wp-content/uploads/sites/30/2022/04/image-30-900x600-2.jpg',
    'https://market-muscles-server-3.s3.us-east-2.amazonaws.com/wp-content/uploads/sites/166/2020/09/08155050/1.jpg',
    'https://files.gymdesk.com/1342/uploads/Calvert%20MMA%20Adult%20Beginner%20BJJ.JPG',
    'https://cdn.evolve-mma.com/wp-content/uploads/2016/05/yodsanansityodtong-evolvefightteam-1.jpg',
    'https://phoenixmartialartsclub.ca/wp-content/uploads/2024/09/Untitled-design-2024-09-26T134829.949-1-1024x538.png',
    'https://32e89e35f40b6cd99824.cdn6.editmysite.com/uploads/b/32e89e35f40b6cd9982406918bc4e4c3690534f391299bd0b3131b74b81492dc/8_1677553659.png?width=2400&optimize=medium',
    'https://cdn.prod.website-files.com/67b75a5f98a3dca8348c674d/67bb7ac0295cefc281bd2c67_Kids%20Confidence%20at%20Complete%20Control%20in%20Adelaide%20SA%20desktop.webp',
    'https://cdn.prod.website-files.com/67b75a5f98a3dca8348c674d/67bb7ac0295cefc281bd2c67_Kids%20Confidence%20at%20Complete%20Control%20in%20Adelaide%20SA%20desktop.webp',
  ],
  'law-firm': [
    'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
    'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg',
    'https://images.pexels.com/photos/5668860/pexels-photo-5668860.jpeg',
    'https://images.pexels.com/photos/5668861/pexels-photo-5668861.jpeg',
    'https://images.pexels.com/photos/5668862/pexels-photo-5668862.jpeg',
    'https://images.pexels.com/photos/5668863/pexels-photo-5668863.jpeg',
    'https://images.pexels.com/photos/5668864/pexels-photo-5668864.jpeg',
    'https://images.pexels.com/photos/5668865/pexels-photo-5668865.jpeg',
    'https://images.pexels.com/photos/5668866/pexels-photo-5668866.jpeg',
    'https://images.pexels.com/photos/5668867/pexels-photo-5668867.jpeg',
    'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
  ],
  'accounting': [
    'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
    'https://images.pexels.com/photos/6863184/pexels-photo-6863184.jpeg',
    'https://images.pexels.com/photos/6863185/pexels-photo-6863185.jpeg',
    'https://images.pexels.com/photos/6863186/pexels-photo-6863186.jpeg',
    'https://images.pexels.com/photos/6863187/pexels-photo-6863187.jpeg',
    'https://images.pexels.com/photos/6863188/pexels-photo-6863188.jpeg',
    'https://images.pexels.com/photos/6863189/pexels-photo-6863189.jpeg',
    'https://images.pexels.com/photos/6863190/pexels-photo-6863190.jpeg',
    'https://images.pexels.com/photos/6863191/pexels-photo-6863191.jpeg',
    'https://images.pexels.com/photos/6863192/pexels-photo-6863192.jpeg',
    'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
  ],
  'financial-advisor': [
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    'https://images.pexels.com/photos/6801649/pexels-photo-6801649.jpeg',
    'https://images.pexels.com/photos/6801650/pexels-photo-6801650.jpeg',
    'https://images.pexels.com/photos/6801651/pexels-photo-6801651.jpeg',
    'https://images.pexels.com/photos/6801652/pexels-photo-6801652.jpeg',
    'https://images.pexels.com/photos/6801653/pexels-photo-6801653.jpeg',
    'https://images.pexels.com/photos/6801654/pexels-photo-6801654.jpeg',
    'https://images.pexels.com/photos/6801655/pexels-photo-6801655.jpeg',
    'https://images.pexels.com/photos/6801656/pexels-photo-6801656.jpeg',
    'https://images.pexels.com/photos/6801657/pexels-photo-6801657.jpeg',
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
  ],
  'real-estate': [
    'https://imageio.forbes.com/specials-images/imageserve/743951458/0x0.jpg?format=jpg&height=600&width=1200&fit=bounds',
    'https://rmmatac.com/wp-content/uploads/2022/02/Real-Estate.jpg',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://californiacivilattorneys.com/wp-content/uploads/2025/07/WL_Blogs-JULY-2025-13.jpg',
    'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/13645887/63609_728422.jpeg',
    'https://atriarealestate.com.au/wp-content/uploads/2023/09/Copy-of-10-Companies-That-Hire-for-Remote-Real-Estate-Jobs.jpeg',
    'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg',
    'https://images.pexels.com/photos/1396129/pexels-photo-1396129.jpeg',
    'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg',
    'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/13645887/63609_728422.jpeg',
    'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/13645887/63609_728422.jpeg',
  ],
  'insurance': [
    'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
    'https://cdn.vietnambiz.vn/2020/1/19/how-to-buy-home-insurance-to-protect-against-natural-calamities-15793984708291269107647.jpg',
    'https://www.candsins.com/wp-content/uploads/business-finance-technology.jpg',
    'https://darkhorseinsurance.com/wp-content/uploads/2024/10/img-hero-4-things-you-should-know-about-EO-insurance.jpg',
    'https://uploads-ssl.webflow.com/62f7a1aa269706e43cbd86c6/62f7a40c81eec0452b05424d_Insurance-Agent-1.jpg',
    'https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg',
    'https://images.pexels.com/photos/3760073/pexels-photo-3760073.jpeg',
    'https://images.pexels.com/photos/3760074/pexels-photo-3760074.jpeg',
    'https://images.pexels.com/photos/3760075/pexels-photo-3760075.jpeg',
    'https://www.candsins.com/wp-content/uploads/business-finance-technology.jpg',
    'https://www.candsins.com/wp-content/uploads/business-finance-technology.jpg',
  ],
  'web-agency': [
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
    'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg',
    'https://images.pexels.com/photos/3861976/pexels-photo-3861976.jpeg',
    'https://images.pexels.com/photos/3861960/pexels-photo-3861960.jpeg',
    'https://images.pexels.com/photos/3861978/pexels-photo-3861978.jpeg',
    'https://images.pexels.com/photos/3861962/pexels-photo-3861962.jpeg',
    'https://images.pexels.com/photos/3861980/pexels-photo-3861980.jpeg',
    'https://images.pexels.com/photos/3861966/pexels-photo-3861966.jpeg',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  ],
  'photography': [
    'https://sunny16.com/cdn/shop/articles/What_is_Stock_Photography_Business_-_Stock_Photography_Examples_-_Header_-_Sunny_16_bb6dd35b-1406-401f-a9e9-93e58d0acef3.jpg?v=1746484948&width=1100',
    'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2021/03/photography-projects-1001.jpg?fit=1500%2C1000&ssl=1',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D',
    'https://www.kunstloft.com/magazine/wp-content/uploads/2023/08/camera-g600862fcc_1280-1024x768.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Photographer_Photographing_Nevada_Mountains.jpg/1280px-Photographer_Photographing_Nevada_Mountains.jpg',
    'https://www.nyip.edu/media/zoo/images/top-5-photography-trends-in-2023-for-budding-photographers-1_7ab20070adafbe94d85f51804d9a9bdf.jpg',
    'https://birdsofpreycentre.co.uk/wp-content/uploads/2016/03/Photography-Camera-HD-Wallpaper1.jpg',
    'https://www.adobe.com/creativecloud/photography/discover/media_10283a3764253f184668acd8a9807540c9746fe22.png?width=750&format=png&optimize=medium',
    'https://cdn.guardian.ng/wp-content/uploads/2024/08/wealthy-photographer.jpg',
    'https://static1.squarespace.com/static/675176954189cc3a0d973e74/t/679cdae5fa915d309a40de5a/1738332905817/Genres+of+Photography+social+Thumbnail+2000px60.jpg?format=1500w',
    'https://static1.squarespace.com/static/675176954189cc3a0d973e74/t/679cdae5fa915d309a40de5a/1738332905817/Genres+of+Photography+social+Thumbnail+2000px60.jpg?format=1500w',
  ],
  'graphic-design': [
    'https://learn.g2.com/hubfs/iStock-1191609321%20%281%29.jpg',
    'https://mybeta.ca/wp-content/uploads/2025/04/graphic-design.jpg',
    'https://cdn.sanity.io/images/599r6htc/regionalized/9b77f71ca678d0bb77964022ec889ceebbac344a-1440x720.png?w=1440&h=720&q=75&fit=max&auto=format',
    'https://cdn.sanity.io/images/599r6htc/regionalized/e75b3406316336729cd51bacd22c70f0e3ec9169-1440x643.png?w=1440&h=643&q=75&fit=max&auto=format',
    'https://images.ctfassets.net/szez98lehkfm/7qjhPfcvfIhxoHyXZnO6k/4152f21558d846177639a35a061fb664/MyIC_Article_114836',
    'https://images.pexels.com/photos/3585093/pexels-photo-3585093.jpeg',
    'https://www.wilmu.edu/technology/images/graphic-design-bs-lg.jpg',
    'https://duhocnamphong.vn/images/news/2020/04/original/nganh-graphic-design---nhieu-co-hoi-lam-thach-thuc_1586331157.png',
    'https://www.verbolabs.com/wp-content/uploads/2024/09/types-of-graphic-design.jpg',
    'https://images.pexels.com/photos/3585097/pexels-photo-3585097.jpeg',
    'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg',
  ],
  'electrician': [
    'https://images.pexels.com/photos/2539462/pexels-photo-2539462.jpeg',
    'https://www.centuracollege.edu/wp-content/uploads/2025/05/5_5-CEN-Electrician2-min-scaled.jpg',
    'https://tselectricalservice.co.uk/wp-content/uploads/2025/01/shutterstock_1052273741.webp',
    'https://studyhub.org.uk/wp-content/uploads/2024/09/man-electrical-technician-working-switchboard-with-fuses-min-1-scaled.jpg',
    'https://iecfwtc.org/wp-content/uploads/2015/12/Electrician-scaled.jpg',
    'https://contractortrainingcenter.com/cdn/shop/articles/Untitled_design_1.png?v=1693506427',
    'https://www.portseattle.org/sites/default/files/styles/detailpageimagesize/public/2018-10/Neal_150213_40_0.jpg?itok=AgrYuCiI',
    'https://i.insider.com/6515d3f698683c0019469ef0?width=700',
    'https://www.jobsandskills.wa.gov.au/sites/default/files/styles/apprentice/public/2024-12/jswa-at-electrician-electrical.jpg?itok=i4er9_5F',
    'https://images.pexels.com/photos/2539471/pexels-photo-2539471.jpeg',
    'https://images.pexels.com/photos/2539462/pexels-photo-2539462.jpeg',
  ],
  'plumber': [
    'https://sc-cms-prod103-cdn-dsb5cvath4adbgd0.z01.azurefd.net/-/media/images/aerotek/business-insights/plumbing_career_social-jpg.jpg?rev=d535c3705c67442fb68fe4404fae26d1',
    'https://www.steadyfloplumbing.com/wp-content/uploads/2023/10/plumbing-services-1920w.jpg',
    'https://goldcoastschools.com/wp-content/uploads/2024/11/GettyImages-1459326401-1.jpg',
    'https://b3355843.smushcdn.com/3355843/wp-content/uploads/2024/11/plumber-fixing-leak-in-kitchen-sink.jpg?lossy=2&strip=1&webp=1',
    'https://sitescdn.wearevennture.co.uk/public/spencer-clarke-group/assets/60040011.png',
    'https://urbanclap.ae/wp-content/uploads/2025/06/plumber.webp',
    'https://www.danwoodservices.com/wp-content/uploads/2025/03/plumber-vs-handyman.jpg',
    'https://static.homeguide.com/assets/images/content/homeguide-plumber-using-wrench-to-fix-leaking-bathroom-sink.jpg',
    'https://www.steadyfloplumbing.com/wp-content/uploads/2023/10/plumbing-services-1920w.jpg',
    'https://images.pexels.com/photos/4439434/pexels-photo-4439434.jpeg',
    'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg',
  ],
  'landscaping': [
    'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg',
    'https://greenacreslandscapeinc.com/wp-content/uploads/2022/02/Green-Acres-Landscape-Inc-1080x675.jpg',
    'https://cclandscapes.ca/wp-content/uploads/2023/09/CSVS4239-scaled.webp',
    'https://cdn2.hubspot.net/hubfs/4598250/Photos%20Low%20Rez/Crew/grassperson-crew-lawn-maintenance-leaf-raking-truck.jpg',
    'https://schengen.work/wp-content/uploads/2022/09/Site-800-%C3%97-500-px-7-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBTnlis1HlmJViBGDIcoBc7WcJGMaOvd-fCA&s',
    'https://www.rockwaterfarm.com/hs-fs/hubfs/Images/June%202019/outdoor-kitchen-construction-grading-technician-3.jpg?width=1400&name=outdoor-kitchen-construction-grading-technician-3.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8DJhe3xSjs_YF-9snmAy0rmrszdlp0j2dg&s',
    'https://www.spyker.com/wp-content/uploads/2022/03/021622_Header-Image.jpg',
    'https://images.pexels.com/photos/1453508/pexels-photo-1453508.jpeg',
    'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg',
  ],
  'cleaning-service': [
    'https://cdn.openworksweb.com/wp-content/uploads/2026/03/61392e6b85cca9544875c7d2_shutterstock_589490129.jpeg',
    'https://carevietnam.vn/storage/tin-tuc/tin-tuc-moi/hinh-anh-khong-gian-duoc-ve-sinh-sach-khuan.png',
    'https://cdn.prod.website-files.com/662a9a0b1860cf22db41bd69/662ff7377dec6027e008a4ac_Professional%20cleaning%20service%20(1).webp',
    'https://thecleanstart.com/wp-content/uploads/2021/02/House-Cleaning-Service.jpg',
    'https://static.vecteezy.com/system/resources/thumbnails/070/038/664/small/happy-black-guy-and-his-wife-aiming-spray-detergents-at-camera-performing-domestic-cleanup-indoors-millennial-african-american-couple-keeping-their-home-tidy-and-clean-photo.jpg',
    'https://www.govchain.co.za/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fonvsvlsh%2Fproduction%2F24a35c1116cfe953ccf6e8d0f65a72f081ac32de-2317x1194.jpg%3Fh%3D500&w=3840&q=75',
    'https://www.rbcclean.com/wp-content/uploads/2025/03/shutterstock_2453839265-1.jpg',
    'https://www.maid.co.uk/wp-content/uploads/2023/02/shutterstock_1681685233-scaled.jpg',
    'https://safaiwale.in/wp-content/uploads/2024/11/House-cleaning.webp',
    'https://images.pexels.com/photos/4107129/pexels-photo-4107129.jpeg',
    'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg',
  ],
  'interior-design': [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg',
    'https://evolveartisanal.com/wp-content/uploads/2021/07/1_The-Wooden-Rhapsody-Modern-Bedroom-Interior-Design.jpg',
    'https://media.houseandgarden.co.uk/photos/68777bdecc005cf2ffdcae29/3:2/w_4998,h_3332,c_limit/240320_Ravensdon093V1-production_digital.jpg',
    'https://www.familyhandyman.com/wp-content/uploads/2024/01/GettyImages-1394816490.-Eclectic-Interior-Design-JVedit.jpg',
    'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg',
    'https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg',
    'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
    'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  ],
  'video-production': [
    'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg',
    'https://images.pexels.com/photos/2510429/pexels-photo-2510429.jpeg',
    'https://images.pexels.com/photos/2510430/pexels-photo-2510430.jpeg',
    'https://images.pexels.com/photos/2510431/pexels-photo-2510431.jpeg',
    'https://images.squarespace-cdn.com/content/v1/66094a7b76a00422871fa242/1721215357418-JBDNBAAO78OLJUKVNXO5/professional-video-production.jpg',
    'https://images.pexels.com/photos/2510433/pexels-photo-2510433.jpeg',
    'https://images.pexels.com/photos/2510434/pexels-photo-2510434.jpeg',
    'https://images.pexels.com/photos/2510435/pexels-photo-2510435.jpeg',
    'https://images.pexels.com/photos/2510436/pexels-photo-2510436.jpeg',
    'https://images.pexels.com/photos/2510437/pexels-photo-2510437.jpeg',
    'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg',
  ],
}
// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE MAPS EMBED
// ═══════════════════════════════════════════════════════════════════════════
function GoogleMapEmbed({ address }: { address: string }) {
  return (
    <div className="w-full aspect-[16/9] overflow-hidden border" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>
      <iframe
        width="100%" height="100%" loading="lazy" style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════════════════════
interface Theme { bg: string; bgAlt: string; bgDeep: string; text: string; textMuted: string; textDim: string; accent: string; accentText: string; accentSoft: string; border: string; borderStrong: string; headingFont: string; bodyFont: string; radius: string }

const THEMES: Record<string, Theme> = {
  beauty: { bg:'#100d0c',bgAlt:'#1c1614',bgDeep:'#0a0807',text:'#faf6f1',textMuted:'rgba(250,246,241,0.62)',textDim:'rgba(250,246,241,0.32)',accent:'#cd9b5f',accentText:'#100d0c',accentSoft:'rgba(205,155,95,0.12)',border:'rgba(205,155,95,0.15)',borderStrong:'rgba(205,155,95,0.35)',headingFont:'"Cormorant Garamond",serif',bodyFont:'"Plus Jakarta Sans",sans-serif',radius:'2px' },
  food: { bg:'#0d0a08',bgAlt:'#19130e',bgDeep:'#070504',text:'#fffaf3',textMuted:'rgba(255,250,243,0.62)',textDim:'rgba(255,250,243,0.32)',accent:'#d97a3a',accentText:'#0d0a08',accentSoft:'rgba(217,122,58,0.12)',border:'rgba(217,122,58,0.15)',borderStrong:'rgba(217,122,58,0.35)',headingFont:'"Playfair Display",serif',bodyFont:'"Plus Jakarta Sans",sans-serif',radius:'4px' },
  medical: { bg:'#07090d',bgAlt:'#101522',bgDeep:'#040508',text:'#f2f6fc',textMuted:'rgba(242,246,252,0.62)',textDim:'rgba(242,246,252,0.32)',accent:'#4f8fc9',accentText:'#07090d',accentSoft:'rgba(79,143,201,0.12)',border:'rgba(79,143,201,0.15)',borderStrong:'rgba(79,143,201,0.35)',headingFont:'"Source Serif 4",serif',bodyFont:'"Inter",sans-serif',radius:'8px' },
  legal: { bg:'#09090b',bgAlt:'#131316',bgDeep:'#050506',text:'#f4f0f0',textMuted:'rgba(244,240,240,0.62)',textDim:'rgba(244,240,240,0.32)',accent:'#b9914a',accentText:'#09090b',accentSoft:'rgba(185,145,74,0.12)',border:'rgba(185,145,74,0.15)',borderStrong:'rgba(185,145,74,0.35)',headingFont:'"Cormorant Garamond",serif',bodyFont:'"Lora",serif',radius:'2px' },
  fitness: { bg:'#0a0a0a',bgAlt:'#151515',bgDeep:'#040404',text:'#fdfdfd',textMuted:'rgba(253,253,253,0.62)',textDim:'rgba(253,253,253,0.32)',accent:'#e8451f',accentText:'#fdfdfd',accentSoft:'rgba(232,69,31,0.12)',border:'rgba(232,69,31,0.15)',borderStrong:'rgba(232,69,31,0.38)',headingFont:'"Bebas Neue",sans-serif',bodyFont:'"Space Grotesk",sans-serif',radius:'6px' },
  creative: { bg:'#070707',bgAlt:'#101010',bgDeep:'#000',text:'#fbfbfb',textMuted:'rgba(251,251,251,0.62)',textDim:'rgba(251,251,251,0.32)',accent:'#e0e0e0',accentText:'#070707',accentSoft:'rgba(255,255,255,0.08)',border:'rgba(255,255,255,0.1)',borderStrong:'rgba(255,255,255,0.25)',headingFont:'"Fraunces",serif',bodyFont:'"Space Grotesk",sans-serif',radius:'0px' },
  retail: { bg:'#0a0c0a',bgAlt:'#141815',bgDeep:'#060807',text:'#f5f8f4',textMuted:'rgba(245,248,244,0.62)',textDim:'rgba(245,248,244,0.32)',accent:'#7a9b6e',accentText:'#0a0c0a',accentSoft:'rgba(122,155,110,0.12)',border:'rgba(122,155,110,0.15)',borderStrong:'rgba(122,155,110,0.35)',headingFont:'"Fraunces",serif',bodyFont:'"Inter",sans-serif',radius:'10px' },
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY MAP — NGUỒN DUY NHẤT cho cả Theme và Layout
// ═══════════════════════════════════════════════════════════════════════════
type Category = 'beauty' | 'food' | 'medical' | 'legal' | 'fitness' | 'creative' | 'retail'

const CATEGORY_MAP: Record<string, Category> = {
  'nail-salon': 'beauty', 'beauty-salon': 'beauty', 'spa': 'beauty', 'barbershop': 'beauty',
  'tattoo-studio': 'beauty', 'lash-studio': 'beauty', 'makeup-artist': 'beauty',
  'florist': 'beauty', 'jewellery': 'beauty', 'boutique-clothing': 'beauty', 'clothing': 'beauty',
  'dental': 'medical', 'medical': 'medical', 'veterinary': 'medical', 'pharmacy': 'medical',
  'chiropractor': 'medical', 'physio': 'medical', 'optometrist': 'medical',
  'restaurant': 'food', 'cafe': 'food', 'bakery': 'food', 'food-truck': 'food',
  'wine-bar': 'food', 'sushi-restaurant': 'food', 'ice-cream-shop': 'food',
  'pet-shop': 'retail', 'bookshop': 'retail',
  'gym': 'fitness', 'yoga-studio': 'fitness', 'personal-trainer': 'fitness',
  'pilates': 'fitness', 'martial-arts': 'fitness',
  'law-firm': 'legal', 'accounting': 'legal', 'financial-advisor': 'legal',
  'real-estate': 'legal', 'insurance': 'legal',
  'web-agency': 'creative', 'photography': 'creative', 'graphic-design': 'creative',
  'electrician': 'creative', 'plumber': 'creative', 'landscaping': 'creative',
  'cleaning-service': 'creative', 'interior-design': 'creative', 'video-production': 'creative',
}

const _IND_MAP: Record<string, string> = {
  "nail_salon": "nail-salon",
  "beauty_salon": "beauty-salon",
  "spa": "spa",
  "dental": "dental",
  "medical": "medical",
  "veterinary": "veterinary",
  "restaurant": "restaurant",
  "cafe": "cafe",
  "law_firm": "law-firm",
  "real_estate": "real-estate",
  "finance": "accounting",
  "gym": "gym",
  "plumbing": "plumber",
  "electrical": "electrician",
  "hvac": "plumber",
  "contractor": "landscaping",
  "auto_repair": "web-agency",
  "cleaning": "cleaning-service",
  "photography": "photography",
  "moving": "web-agency",
  "childcare": "web-agency",
  "tattoo": "tattoo-studio",
  "ecommerce": "clothing",
  "landing_page": "web-agency",
  "tech": "web-agency",
  "education": "web-agency",
  "hotel": "spa",
  "generic": "web-agency",
}
function getCategory(slug: string): Category {
  return CATEGORY_MAP[slug] ?? 'creative'
}

// ═══════════════════════════════════════════════════════════════════════════
// INDUSTRIES DATA — BEAUTY (7)
// ═══════════════════════════════════════════════════════════════════════════
const INDUSTRIES_DATA: Record<string, IndustryConfig> = {
  'nail-salon': {
    name: 'Luxe Nail Studio', tagline: 'Precision. Polish. Perfection.',
    headline: 'Nails That Command Attention',
    subheadline: 'Premium gel manicures, luxury acrylic extensions, and meticulous nail art in a serene oasis.',
    about: 'We believe your hands tell your story. Our boutique studio provides high-end nail care with absolute hygiene and premium, non-toxic products. Every visit is a personalized ritual designed around you.',
    services: [
      { name: 'Signature Gel Manicure', desc: 'Detailed cuticle care, shaping, and flawless gel application lasting 3+ weeks.', price: '$45' },
      { name: 'Apres Gel-X Extensions', desc: 'Full set of soft gel extensions in customized shapes and lengths.', price: '$85' },
      { name: 'Custom Nail Art', desc: 'Hand-painted abstract, chrome, or minimal line art matching your style.', price: '$25' },
      { name: 'Spa Pedicure', desc: 'Foot soak, exfoliation, cuticle work, and polish in a relaxing spa chair.', price: '$55' },
    ],
    stats: [{ value: '4.9★', label: 'Google Rating' }, { value: '200+', label: 'Gel Shades' }, { value: '3k+', label: 'Happy Clients' }],
    reviews: [
      { name: 'Sophie L.', rating: 5, text: 'Absolutely obsessed with my nails every single time. The attention to detail is unmatched!', date: 'Dec 2025' },
      { name: 'Rachel M.', rating: 5, text: 'Best nail studio in the city. Sterile, stylish, and the gel lasts over a month!', date: 'Nov 2025' },
      { name: 'Aisha T.', rating: 5, text: 'The nail art they did for my wedding was beyond my expectations. Pure perfection.', date: 'Oct 2025' },
    ],
    address: '12 Blossom Lane, Suite 3, Sydney NSW', phone: '+61 2 9001 1234', email: 'hello@luxenail.com', hours: 'Mon–Sat 9am–7pm, Sun 10am–5pm'
  },
  'beauty-salon': {
    name: 'Glow Hair & Beauty', tagline: 'Luminous Hair, Crafted for You.',
    headline: 'Reveal Your Most Radiant Self',
    subheadline: 'Bespoke highlights, custom balayage, and restorative treatments by master stylists.',
    about: 'At Glow, we treat hair styling as an art form. We combine detailed consultations with cutting-edge color techniques to deliver stunning, healthy hair that turns heads.',
    services: [
      { name: 'French Balayage', desc: 'Hand-painted, natural highlights tailored to enhance your face shape and hair flow.', price: '$180' },
      { name: 'Precision Haircut & Blowout', desc: 'Stylized haircut finished with a premium blowout and thermal styling.', price: '$75' },
      { name: 'Keratin Smoothing', desc: 'Deep conditioning treatment that eliminates frizz for up to 5 months.', price: '$250' },
      { name: 'Color Correction', desc: 'Expert multi-step color correction to achieve your perfect shade safely.', price: '$220' },
    ],
    stats: [{ value: '4.8★', label: 'Average Review' }, { value: '12yr', label: 'Experience' }, { value: '500+', label: 'Color Clients' }],
    reviews: [
      { name: 'Emma W.', rating: 5, text: 'My balayage looks like I stepped off a Paris runway. The team here are true artists.', date: 'Dec 2025' },
      { name: 'Chloe B.', rating: 5, text: 'First time getting a keratin treatment here — absolutely zero frizz for 4 months!', date: 'Nov 2025' },
      { name: 'Priya S.', rating: 4, text: 'Great atmosphere and very knowledgeable stylists. Will definitely be back.', date: 'Oct 2025' },
    ],
    address: '88 Crown Street, Surry Hills NSW', phone: '+61 2 9002 5678', email: 'bookings@glowhair.com', hours: 'Tue–Sat 9am–6pm'
  },
  'spa': {
    name: 'Aetheria Wellness Spa', tagline: 'Restore Balance. Cultivate Calm.',
    headline: 'Your Sanctuary of Pure Relaxation',
    subheadline: 'Indulge in hot stone therapy, revitalizing facials, and complete holistic body treatments.',
    about: 'Escape the rush of modern life. Aetheria provides customized sensory rituals designed to restore equilibrium to your body, mind, and spirit using 100% organic products.',
    services: [
      { name: 'Deep Tissue Ritual', desc: 'Targeted muscle release combined with therapeutic aromatherapy oils.', price: '$120' },
      { name: 'Luminous HydraFacial', desc: 'Deep clean, exfoliation, extraction, and intense hydration with premium serums.', price: '$140' },
      { name: 'Himalayan Hot Stone Massage', desc: 'Volcanic basalt stones glide over muscles to melt away stress and tension.', price: '$150' },
      { name: 'Couples Retreat Package', desc: 'Side-by-side massages, champagne, and private hot tub access for two.', price: '$290' },
    ],
    stats: [{ value: '10+', label: 'Treatment Rooms' }, { value: '100%', label: 'Organic Products' }, { value: '5★', label: 'Rating' }],
    reviews: [
      { name: 'Laura K.', rating: 5, text: 'The hot stone massage was transcendent. I floated out of there. Absolutely divine.', date: 'Dec 2025' },
      { name: 'James R.', rating: 5, text: 'Brought my partner for the couples package — she cried happy tears. Worth every cent.', date: 'Nov 2025' },
      { name: 'Nina P.', rating: 5, text: 'Best facial I have ever had. My skin was literally glowing for two weeks after.', date: 'Oct 2025' },
    ],
    address: '22 Serenity Boulevard, Mosman NSW', phone: '+61 2 9003 9012', email: 'relax@aetheriaspa.com', hours: 'Daily 9am–8pm'
  },
  'barbershop': {
    name: 'The Vintage Razor', tagline: 'Classic Cuts. Modern Gentleman.',
    headline: 'More Than a Haircut. A Ritual.',
    subheadline: 'Precision fades, hot towel shaves, and beard sculpting from master barbers.',
    about: 'Steeped in tradition, The Vintage Razor delivers premium grooming for the modern man. Enjoy a complimentary drink and relax in our classic leather chairs.',
    services: [
      { name: 'Signature Haircut', desc: 'Consultation, precision cut, hot towel finish, and style.', price: '$40' },
      { name: 'Traditional Hot Shave', desc: 'Pre-shave oils, warm lather, straight-razor shave, and cold press.', price: '$50' },
      { name: 'Beard Sculpt & Shape', desc: 'Lineup, trim, and conditioning with organic oils and balm.', price: '$30' },
      { name: 'Cut & Shave Combo', desc: 'Full haircut plus straight-razor shave in one seamless session.', price: '$75' },
    ],
    stats: [{ value: '4', label: 'Master Barbers' }, { value: '98%', label: 'Retention Rate' }, { value: '15k+', label: 'Cuts Done' }],
    reviews: [
      { name: 'James P.', rating: 5, text: 'Best barber in the city, hands down. Perfect fade every single time.', date: 'Dec 2025' },
      { name: 'Marcus T.', rating: 5, text: 'The hot shave is incredible. Walked out feeling like a new man.', date: 'Nov 2025' },
      { name: 'Luca B.', rating: 5, text: 'Great atmosphere, great conversation, great cut. My go-to spot.', date: 'Oct 2025' },
    ],
    address: '22 Blade Street, Surry Hills NSW', phone: '+61 2 9011 3333', email: 'book@vintagerazor.com', hours: 'Tue–Sat 9am–7pm, Sun 10am–4pm'
  },
  'tattoo-studio': {
    name: 'Obsidian Ink Studio', tagline: 'Permanent Art. Personal Story.',
    headline: 'Custom Tattoo Artistry, Done Right',
    subheadline: 'Fine-line, blackwork, and full-color custom designs from licensed resident artists.',
    about: 'Every piece starts as a conversation. Our artists work one-on-one with you to translate your story into permanent art, using hospital-grade sterilization in a private, judgment-free studio.',
    services: [
      { name: 'Custom Fine-Line Piece', desc: 'Hand-drawn custom design, consultation included, 2-3 hour session.', price: 'From $250' },
      { name: 'Blackwork Sleeve Session', desc: 'Bold geometric or tribal blackwork, booked per session.', price: '$150/hr' },
      { name: 'Cover-Up Consultation', desc: 'Free assessment and custom design plan to rework old or unwanted tattoos.', price: 'Free consult' },
      { name: 'Touch-Up & Aftercare', desc: 'Complimentary touch-up within 6 weeks, plus aftercare kit.', price: 'Included' },
    ],
    stats: [{ value: '4.9★', label: 'Google Rating' }, { value: '12yr', label: 'Studio Experience' }, { value: '3', label: 'Resident Artists' }],
    reviews: [
      { name: 'Derek M.', rating: 5, text: 'My artist nailed the design on the first sketch. Healed perfectly, zero issues.', date: 'Dec 2025' },
      { name: 'Sarah K.', rating: 5, text: 'Covered up an old tattoo I hated for 10 years. Genuinely life-changing result.', date: 'Nov 2025' },
      { name: 'Tom R.', rating: 5, text: 'Spotless studio, professional from booking to aftercare. Worth the wait list.', date: 'Oct 2025' },
    ],
    address: '15 Ink Alley, Newtown NSW', phone: '+61 2 9015 7777', email: 'book@obsidianink.com', hours: 'Tue–Sun 11am–8pm (by appointment)'
  },
  'lash-studio': {
    name: 'Iris Lash & Brow Studio', tagline: 'Wake Up Already Beautiful.',
    headline: 'Lashes That Do the Work for You',
    subheadline: 'Classic, hybrid, and volume lash extensions plus precision brow lamination.',
    about: 'Iris Studio is built around one idea: low-maintenance beauty that looks effortless. Our certified lash artists use medical-grade adhesives gentle enough for sensitive eyes.',
    services: [
      { name: 'Classic Lash Set', desc: 'One extension per natural lash for a soft, everyday enhanced look.', price: '$90' },
      { name: 'Volume Lash Set', desc: 'Lightweight fans of fine extensions for a fuller, dramatic finish.', price: '$130' },
      { name: 'Brow Lamination & Tint', desc: 'Brows reshaped, lifted, and tinted for a fluffy, fuller appearance.', price: '$65' },
      { name: '2-Week Lash Refill', desc: 'Fill gaps and replace shed lashes to keep your set looking fresh.', price: '$55' },
    ],
    stats: [{ value: '4.9★', label: 'Google Rating' }, { value: '4hr', label: 'Avg. Retention' }, { value: '5k+', label: 'Sets Applied' }],
    reviews: [
      { name: 'Megan H.', rating: 5, text: 'My volume set lasted nearly 4 weeks and never irritated my eyes. Incredible work.', date: 'Dec 2025' },
      { name: 'Tina V.', rating: 5, text: 'Brow lamination changed my whole face. So precise and gentle.', date: 'Nov 2025' },
      { name: 'Hana W.', rating: 5, text: 'Cleanest, most relaxing lash studio I have been to. Booking again already.', date: 'Oct 2025' },
    ],
    address: '9 Velvet Lane, Bondi Junction NSW', phone: '+61 2 9016 8888', email: 'hello@irislash.com', hours: 'Mon–Sat 9am–6pm'
  },
  'makeup-artist': {
    name: 'Velvet Brush Makeup Studio', tagline: 'Your Face, Elevated.',
    headline: 'Makeup Artistry for Real Moments',
    subheadline: 'Bridal trials, editorial looks, and event makeup that photographs as good as it feels.',
    about: 'Velvet Brush works with skin first, makeup second — building long-wear, photo-ready looks tailored to your features, your event, and the cameras that will be there.',
    services: [
      { name: 'Bridal Trial + Day-Of', desc: 'Full trial session plus wedding-day application with touch-up kit.', price: '$450' },
      { name: 'Event Glam Application', desc: 'Full face application for parties, galas, or photoshoots.', price: '$140' },
      { name: 'Editorial / Photoshoot Makeup', desc: 'High-definition camera-ready looks for shoots and campaigns.', price: '$200' },
      { name: 'Makeup Lesson (1-on-1)', desc: 'Personalized 90-minute lesson using your own products and face shape.', price: '$160' },
    ],
    stats: [{ value: '4.9★', label: 'Google Rating' }, { value: '300+', label: 'Weddings Done' }, { value: '8yr', label: 'Experience' }],
    reviews: [
      { name: 'Olivia F.', rating: 5, text: 'My wedding makeup lasted through tears, dancing, and the heat. Flawless all night.', date: 'Dec 2025' },
      { name: 'Grace M.', rating: 5, text: 'The photoshoot look she did for me got reposted everywhere. True artistry.', date: 'Nov 2025' },
      { name: 'Bianca R.', rating: 5, text: 'Took the time to actually teach me technique, not just apply makeup. Worth it.', date: 'Oct 2025' },
    ],
    address: '31 Palette Street, Paddington NSW', phone: '+61 2 9017 9999', email: 'studio@velvetbrush.com', hours: 'By appointment, 7 days'
  },

  // ── MEDICAL & HEALTH (7) ────────────────────────────────────────────────────
  'dental': {
    name: 'Radiant Smile Dental', tagline: 'Gentle Care. Radiant Smiles.',
    headline: 'Exceptional Family & Cosmetic Dentistry',
    subheadline: 'State-of-the-art checkups, teeth whitening, and modern Invisalign clear aligners.',
    about: 'We combine cutting-edge dental technology with a warm, empathetic atmosphere. Our team is dedicated to giving you a stress-free, pain-free dental journey from the very first visit.',
    services: [
      { name: 'Premium Hygiene & Cleaning', desc: 'Comprehensive scaling, stain removal, oral cancer screening, and fluoride.', price: '$120' },
      { name: 'Laser Teeth Whitening', desc: 'In-chair treatment resulting in up to 8 shades lighter in just 60 minutes.', price: '$350' },
      { name: 'Invisalign Consultation', desc: '3D digital scan of your mouth and personalized teeth alignment plan.', price: 'Free' },
      { name: 'Porcelain Veneers', desc: 'Custom ultra-thin veneers for a perfect, natural-looking smile transformation.', price: '$1200' },
    ],
    stats: [{ value: '99%', label: 'Anxiety Free' }, { value: '3D', label: 'Tech Equipped' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Anna K.', rating: 5, text: 'As someone who dreaded the dentist, I cannot believe how comfortable every visit is here.', date: 'Dec 2025' },
      { name: 'Paul R.', rating: 5, text: 'My Invisalign results are phenomenal. The team guided me perfectly throughout.', date: 'Nov 2025' },
      { name: 'Grace T.', rating: 5, text: 'The whitening treatment gave me 7 shades lighter in one visit. Absolutely worth it.', date: 'Oct 2025' },
    ],
    address: '33 Smile Street, Chatswood NSW', phone: '+61 2 9007 2345', email: 'care@radiantsmile.com', hours: 'Mon–Fri 8am–6pm, Sat 9am–2pm'
  },
  'medical': {
    name: 'Harborview Medical Clinic', tagline: 'Whole-Person Care, Close to Home.',
    headline: 'Trusted GP Care for Your Whole Family',
    subheadline: 'Same-day appointments, chronic disease management, and telehealth consultations.',
    about: 'Harborview is a bulk-billing general practice staffed by experienced GPs who actually have time to listen. We focus on continuity of care — the same doctor, visit after visit.',
    services: [
      { name: 'Standard GP Consultation', desc: 'General check-ups, prescriptions, referrals, and same-day sick visits.', price: 'Bulk billed' },
      { name: 'Chronic Disease Care Plan', desc: 'Ongoing management for diabetes, hypertension, and asthma with care coordination.', price: '$0–$45' },
      { name: 'Telehealth Consultation', desc: 'Phone or video consult for prescriptions, results, and minor concerns.', price: '$40' },
      { name: 'Full Health Check-Up', desc: 'Comprehensive 40-minute assessment including bloods and screening referrals.', price: '$95' },
    ],
    stats: [{ value: '12', label: 'GPs On Staff' }, { value: 'Same-Day', label: 'Appointments' }, { value: '4.8★', label: 'Patient Rating' }],
    reviews: [
      { name: 'Helen D.', rating: 5, text: 'Finally a GP who remembers my history without me repeating it every visit.', date: 'Dec 2025' },
      { name: 'Michael C.', rating: 5, text: 'Got a same-day appointment when I was genuinely unwell. Huge relief.', date: 'Nov 2025' },
      { name: 'Fiona S.', rating: 4, text: 'Telehealth option saved me so much time for a simple repeat script.', date: 'Oct 2025' },
    ],
    address: '14 Wellness Way, North Sydney NSW', phone: '+61 2 9018 1010', email: 'reception@harborviewmedical.com', hours: 'Mon–Fri 7:30am–7pm, Sat 9am–1pm'
  },
  'veterinary': {
    name: 'Pawsitive Care Veterinary Hospital', tagline: 'Every Pet. Every Visit. Pure Care.',
    headline: 'Compassionate Veterinary Care for Your Best Friend',
    subheadline: 'Wellness exams, surgery, dental care, and 24/7 emergency support for cats and dogs.',
    about: 'From routine vaccinations to emergency surgery, our hospital is built around fear-free handling and genuine compassion — for your pet and for you.',
    services: [
      { name: 'Wellness Exam & Vaccination', desc: 'Full physical exam, vaccination updates, and parasite prevention plan.', price: '$85' },
      { name: 'Dental Cleaning & Scaling', desc: 'Anesthetic dental clean with full mouth X-rays and assessment.', price: '$320' },
      { name: 'Desexing Surgery', desc: 'Routine spay/neuter with pre-surgical bloods and pain management included.', price: 'From $250' },
      { name: 'Emergency Consultation', desc: '24/7 urgent care for injuries, poisoning, or sudden illness.', price: 'From $150' },
    ],
    stats: [{ value: '24/7', label: 'Emergency Line' }, { value: '6', label: 'Vets On Staff' }, { value: '4.9★', label: 'Pet Parent Rating' }],
    reviews: [
      { name: 'Jess O.', rating: 5, text: 'They saved my dog after he ate something toxic at midnight. Forever grateful.', date: 'Dec 2025' },
      { name: 'Ryan L.', rating: 5, text: 'My cat is terrified of vets but somehow stayed calm through her whole exam here.', date: 'Nov 2025' },
      { name: 'Amanda P.', rating: 5, text: 'Transparent pricing and they explained every option before any procedure.', date: 'Oct 2025' },
    ],
    address: '7 Companion Court, Lane Cove NSW', phone: '+61 2 9019 1212', email: 'frontdesk@pawsitivecare.com', hours: 'Daily 7am–9pm, Emergency 24/7'
  },
  'pharmacy': {
    name: 'HealthPoint Pharmacy & Compounding', tagline: 'Your Health, Personally Prepared.',
    headline: 'More Than a Pharmacy — A Health Partner',
    subheadline: 'Prescription dispensing, custom compounding, vaccinations, and free medication reviews.',
    about: 'HealthPoint blends traditional pharmacy care with custom compounding for patients who need doses or formulations not available off the shelf — backed by pharmacists who actually have time to talk.',
    services: [
      { name: 'Prescription Dispensing', desc: 'Fast turnaround, automatic refill reminders, and home delivery available.', price: 'PBS pricing' },
      { name: 'Custom Compounding', desc: 'Personalized dosage forms, flavoring, and combinations for unique patient needs.', price: 'From $35' },
      { name: 'Flu & Travel Vaccinations', desc: 'Walk-in vaccination service, no appointment required.', price: 'From $25' },
      { name: 'Free MedsCheck Review', desc: 'A pharmacist reviews all your medications for interactions and adherence.', price: 'Free' },
    ],
    stats: [{ value: '7', label: 'Pharmacists On-Site' }, { value: '15min', label: 'Avg. Wait Time' }, { value: '4.8★', label: 'Customer Rating' }],
    reviews: [
      { name: 'Carol N.', rating: 5, text: 'They compounded a formulation my old pharmacy said was impossible. Life-changing.', date: 'Dec 2025' },
      { name: 'David W.', rating: 5, text: 'The MedsCheck review caught an interaction my doctor had missed. Thank you.', date: 'Nov 2025' },
      { name: 'Linda T.', rating: 4, text: 'Quick, friendly, and they actually explain what each medication does.', date: 'Oct 2025' },
    ],
    address: '50 Remedy Road, Chatswood NSW', phone: '+61 2 9020 1313', email: 'info@healthpointpharmacy.com', hours: 'Mon–Sat 8am–8pm, Sun 9am–5pm'
  },
  'chiropractor': {
    name: 'Align & Restore Chiropractic', tagline: 'Move Better. Feel Better. Live Better.',
    headline: 'Get Back to the Life You Want to Live',
    subheadline: 'Spinal adjustments, postural correction, and personalized rehab plans for lasting relief.',
    about: 'We treat the cause, not just the symptom. Every new patient gets a full postural and spinal assessment before we build a plan tailored to how you actually move and live.',
    services: [
      { name: 'Initial Consultation & Assessment', desc: 'Full spinal exam, posture analysis, and personalized treatment plan.', price: '$95' },
      { name: 'Standard Adjustment', desc: 'Targeted spinal manipulation to relieve pain and restore mobility.', price: '$65' },
      { name: 'Postural Correction Program', desc: '6-week structured plan combining adjustments and corrective exercises.', price: '$420' },
      { name: 'Sports Injury Rehab', desc: 'Assessment and treatment plan for sport-related strains and joint issues.', price: '$80' },
    ],
    stats: [{ value: '4.9★', label: 'Patient Rating' }, { value: '10yr', label: 'Clinical Experience' }, { value: '90%', label: 'Pain Improvement Rate' }],
    reviews: [
      { name: 'Steve K.', rating: 5, text: 'Three years of lower back pain gone after one month of treatment here.', date: 'Dec 2025' },
      { name: 'Mia R.', rating: 5, text: 'Finally someone explained WHY my neck hurt, not just cracked it and sent me off.', date: 'Nov 2025' },
      { name: 'Andre L.', rating: 5, text: 'The postural program fixed years of desk-job slouching. Genuinely changed my posture.', date: 'Oct 2025' },
    ],
    address: '18 Spinal Row, Crows Nest NSW', phone: '+61 2 9021 1414', email: 'book@alignrestore.com', hours: 'Mon–Fri 7am–7pm, Sat 8am–1pm'
  },
  'physio': {
    name: 'Momentum Physiotherapy', tagline: 'Recover Stronger. Move Freer.',
    headline: 'Evidence-Based Physiotherapy That Gets Results',
    subheadline: 'Injury rehab, sports physio, and hands-on treatment plans built around your recovery goals.',
    about: 'Momentum combines manual therapy with structured exercise rehabilitation, because lasting recovery needs both. Every plan is built around your specific injury, sport, or daily movement goals.',
    services: [
      { name: 'Initial Physio Assessment', desc: 'Full movement and injury assessment with a personalized recovery roadmap.', price: '$110' },
      { name: 'Standard Treatment Session', desc: 'Hands-on therapy combined with targeted rehab exercises.', price: '$95' },
      { name: 'Sports Injury Program', desc: 'Structured multi-week plan to return safely to training and competition.', price: 'From $450' },
      { name: 'Post-Surgery Rehabilitation', desc: 'Progressive rehab program coordinated with your surgeon\'s recovery timeline.', price: '$95/session' },
    ],
    stats: [{ value: '4.9★', label: 'Patient Rating' }, { value: '6', label: 'Senior Physiotherapists' }, { value: '95%', label: 'Return-to-Sport Rate' }],
    reviews: [
      { name: 'Jordan F.', rating: 5, text: 'Got me back to running 8 weeks after my ACL surgery, ahead of schedule.', date: 'Dec 2025' },
      { name: 'Kelly N.', rating: 5, text: 'Best physio I have been to. Every session had a clear plan and progress.', date: 'Nov 2025' },
      { name: 'Patrick D.', rating: 5, text: 'My shoulder pain that lingered for a year finally resolved in 6 sessions.', date: 'Oct 2025' },
    ],
    address: '26 Recovery Lane, Manly NSW', phone: '+61 2 9022 1515', email: 'hello@momentumphysio.com', hours: 'Mon–Fri 7am–7pm, Sat 8am–2pm'
  },
  'optometrist': {
    name: 'ClearView Optometry', tagline: 'See Life More Clearly.',
    headline: 'Precision Eye Care for Every Stage of Life',
    subheadline: 'Comprehensive eye exams, designer frames, and advanced retinal screening technology.',
    about: 'ClearView combines thorough clinical eye exams with a genuinely enjoyable frame-fitting experience — because finding glasses you love shouldn\'t feel like a chore.',
    services: [
      { name: 'Comprehensive Eye Exam', desc: 'Full vision test, eye health check, and retinal photography screening.', price: '$0–$80' },
      { name: 'Designer Frame Fitting', desc: 'Personalized styling session across our curated designer frame collection.', price: 'From $199' },
      { name: 'Contact Lens Fitting', desc: 'Initial fitting, trial lenses, and training for new contact lens wearers.', price: '$60' },
      { name: 'OCT Retinal Scan', desc: 'Advanced 3D imaging to detect early signs of glaucoma and macular issues.', price: '$45' },
    ],
    stats: [{ value: '4.9★', label: 'Patient Rating' }, { value: '40+', label: 'Designer Frame Brands' }, { value: '15yr', label: 'Clinical Experience' }],
    reviews: [
      { name: 'Natalie B.', rating: 5, text: 'The retinal scan caught an issue my old optometrist missed for years. So thorough.', date: 'Dec 2025' },
      { name: 'Eric H.', rating: 5, text: 'Spent 45 minutes helping me find frames that actually suited my face. No rush at all.', date: 'Nov 2025' },
      { name: 'Sandra Y.', rating: 5, text: 'First time wearing contacts and they were so patient teaching me the technique.', date: 'Oct 2025' },
    ],
    address: '41 Vision Plaza, Chatswood NSW', phone: '+61 2 9023 1616', email: 'reception@clearviewoptometry.com', hours: 'Mon–Fri 9am–6pm, Sat 9am–3pm'
  },

  // ── FOOD (7) ─────────────────────────────────────────────────────────────────
  'restaurant': {
    name: 'The Hearth Kitchen', tagline: 'From Earth to Table.',
    headline: 'Gastronomy Built on Local Harvests',
    subheadline: 'Exquisite seasonal plates, organic wines, and wood-fired mastery in an intimate space.',
    about: 'At The Hearth Kitchen, we celebrate the raw ingredients of our region. Our menus shift monthly, capturing the true essence of each micro-season with zero food waste.',
    services: [
      { name: 'Chef Tasting Menu', desc: 'A curated 7-course journey highlighting our favorite seasonal local ingredients.', price: '$110' },
      { name: 'Wood-Fired Ribeye', desc: 'Dry-aged 35 days, charred with cherrywood, served with heirloom vegetables.', price: '$48' },
      { name: 'Artisan Pasta Selection', desc: 'Hand-rolled daily pasta topped with slow-braised ragu or wild mushrooms.', price: '$29' },
      { name: 'Seasonal Tasting Dessert', desc: 'Chef-selected dessert pairing with local honey and native botanicals.', price: '$18' },
    ],
    stats: [{ value: 'Michelin', label: 'Recommended' }, { value: '100%', label: 'Local Farms' }, { value: '45+', label: 'Organic Wines' }],
    reviews: [
      { name: 'Thomas H.', rating: 5, text: 'The tasting menu was a spiritual experience. Every course better than the last.', date: 'Dec 2025' },
      { name: 'Olivia C.', rating: 5, text: 'That wood-fired ribeye is the best steak I have had in my life. No exaggeration.', date: 'Nov 2025' },
      { name: 'Mark D.', rating: 4, text: 'Exceptional food, beautiful room, and a wine list that rivals any in the country.', date: 'Oct 2025' },
    ],
    address: '45 Ember Lane, Paddington NSW', phone: '+61 2 9100 4321', email: 'reserve@hearthkitchen.com', hours: 'Wed–Sun 6pm–10:30pm'
  },
  'cafe': {
    name: 'Origin Coffee Roasters', tagline: 'Ethically Sourced. Micro-Roasted.',
    headline: 'Fueling Your Passion, One Cup',
    subheadline: 'Single-origin pour-overs, perfectly balanced flat whites, and artisan breakfast toasts.',
    about: 'We travel to origin countries to select beans directly from smallholders. Our micro-roastery highlights the delicate floral and fruity profiles unique to each harvest region.',
    services: [
      { name: 'Single-Origin V60 Pour-Over', desc: 'Slow brewed to reveal the complex tasting notes of our rotating micro-lots.', price: '$6' },
      { name: 'Flat White or Cortado', desc: 'Double espresso pulled over silky, sweet micro-foamed organic milk.', price: '$5' },
      { name: 'Smashed Avocado Toast', desc: 'Sourdough toast, whipped feta, heirloom tomatoes, and microgreens.', price: '$14' },
      { name: 'Cold Brew Flight', desc: 'Three 80ml cold brew varieties including nitro, oat milk, and black.', price: '$12' },
    ],
    stats: [{ value: '86+', label: 'SCA Bean Rating' }, { value: 'Direct', label: 'Trade Only' }, { value: '4.9★', label: 'Google Score' }],
    reviews: [
      { name: 'Ben T.', rating: 5, text: 'The best flat white in the city, hands down. I come here every single morning.', date: 'Dec 2025' },
      { name: 'Sarah J.', rating: 5, text: 'The pour-over flight changed how I think about coffee. Truly exceptional.', date: 'Nov 2025' },
      { name: 'Mike L.', rating: 5, text: 'Great beans, great people, great vibes. My perfect morning spot.', date: 'Oct 2025' },
    ],
    address: '7 Roaster Row, Newtown NSW', phone: '+61 2 9005 3456', email: 'hello@origincoffee.com', hours: 'Mon–Fri 6am–4pm, Sat–Sun 7am–3pm'
  },
  'bakery': {
    name: 'Flour & Crumb Bakehouse', tagline: 'Baked Before Dawn, Gone by Noon.',
    headline: 'Honest Bread, Made the Slow Way',
    subheadline: 'Naturally leavened sourdough, butter croissants, and small-batch pastries baked fresh daily.',
    about: 'Every loaf here ferments for 24 hours before it ever sees the oven. We use stone-milled flour from a single regional mill and skip the shortcuts most bakeries rely on.',
    services: [
      { name: 'Classic Sourdough Loaf', desc: '24-hour fermented country loaf with a crackling crust and open crumb.', price: '$11' },
      { name: 'Butter Croissant', desc: 'Laminated 36 times, baked fresh in small batches three times daily.', price: '$6.5' },
      { name: 'Seasonal Fruit Danish', desc: 'Flaky pastry filled with vanilla custard and whatever fruit is in season.', price: '$7.5' },
      { name: 'Custom Celebration Cake', desc: 'Made-to-order cakes with 48-hour notice, naturally sweetened.', price: 'From $65' },
    ],
    stats: [{ value: '24hr', label: 'Fermentation Time' }, { value: '5am', label: 'Daily Bake Start' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Hannah G.', rating: 5, text: 'This is the only sourdough I will buy now. The crust is unreal.', date: 'Dec 2025' },
      { name: 'Leo M.', rating: 5, text: 'Ordered a birthday cake here and it disappeared in 10 minutes at the party.', date: 'Nov 2025' },
      { name: 'Priya D.', rating: 5, text: 'Their croissants ruined every other croissant in the city for me.', date: 'Oct 2025' },
    ],
    address: '3 Millstone Lane, Rozelle NSW', phone: '+61 2 9024 1717', email: 'hello@flourandcrumb.com', hours: 'Tue–Sun 6am–2pm (closed Mon)'
  },
  'food-truck': {
    name: 'Bao & Street Kitchen', tagline: 'Street Food, Done Properly.',
    headline: 'Bold Street Eats, No Compromises',
    subheadline: 'Hand-folded bao, loaded fries, and bold Asian-fusion flavors served fast and fresh.',
    about: 'We started as one truck with one recipe — a steamed bao filling passed down from a family kitchen. Now we bring that same obsession with flavor to every market, festival, and lunch crowd we serve.',
    services: [
      { name: 'Crispy Pork Belly Bao', desc: 'Steamed bao bun, slow-braised pork belly, pickled slaw, and hoisin glaze.', price: '$9' },
      { name: 'Korean BBQ Loaded Fries', desc: 'Hand-cut fries topped with bulgogi beef, kimchi mayo, and scallions.', price: '$14' },
      { name: 'Crispy Chicken Bao Trio', desc: 'Three mini bao with crispy chicken, spicy slaw, and sesame drizzle.', price: '$15' },
      { name: 'Iced Pandan Coconut Drink', desc: 'House-made pandan syrup with coconut milk over ice.', price: '$6' },
    ],
    stats: [{ value: '5★', label: 'Festival Rating' }, { value: '8', label: 'Markets Weekly' }, { value: '2k+', label: 'Bao Sold Per Week' }],
    reviews: [
      { name: 'Connor B.', rating: 5, text: 'Found this truck at a market and now I track their schedule weekly. Obsessed.', date: 'Dec 2025' },
      { name: 'Vy N.', rating: 5, text: 'The pork belly bao tastes exactly like my grandmother\'s recipe. Incredible.', date: 'Nov 2025' },
      { name: 'Ash R.', rating: 5, text: 'Loaded fries are a full meal on their own. Worth the queue every time.', date: 'Oct 2025' },
    ],
    address: 'Mobile — check schedule, based in Inner West Sydney NSW', phone: '+61 2 9025 1818', email: 'bookings@baostreetkitchen.com', hours: 'Varies by market — see social for weekly schedule'
  },
  'wine-bar': {
    name: 'Somm & Cellar', tagline: 'Small Plates. Honest Wine.',
    headline: 'A Cellar Worth Getting Lost In',
    subheadline: 'Natural and biodynamic wines paired with seasonal small plates in a candlelit cellar room.',
    about: 'Somm & Cellar champions small, independent winemakers who farm honestly and bottle with minimal intervention. Our by-the-glass list rotates weekly so there is always something new to discover.',
    services: [
      { name: 'Sommelier Wine Flight', desc: 'Three curated 60ml pours exploring one region or grape variety.', price: '$32' },
      { name: 'Charcuterie & Cheese Board', desc: 'Local cured meats, artisan cheeses, pickles, and house sourdough.', price: '$38' },
      { name: 'Burrata & Heirloom Tomato', desc: 'Creamy burrata, basil oil, and seasonal heirloom tomatoes.', price: '$24' },
      { name: 'Natural Wine Subscription', desc: 'Monthly two-bottle delivery curated to your taste profile.', price: '$85/mo' },
    ],
    stats: [{ value: '200+', label: 'Wines on List' }, { value: '40+', label: 'Independent Producers' }, { value: '4.8★', label: 'Google Rating' }],
    reviews: [
      { name: 'Isabelle K.', rating: 5, text: 'The flight they recommended completely changed how I think about natural wine.', date: 'Dec 2025' },
      { name: 'Daniel V.', rating: 5, text: 'Cozy, candlelit, and the staff actually know every bottle on the list.', date: 'Nov 2025' },
      { name: 'Renee P.', rating: 4, text: 'My new go-to for date night. The cheese board alone is worth the visit.', date: 'Oct 2025' },
    ],
    address: '19 Cellar Lane, Surry Hills NSW', phone: '+61 2 9026 1919', email: 'reserve@sommandcellar.com', hours: 'Tue–Sat 4pm–midnight'
  },
  'sushi-restaurant': {
    name: 'Mori Sushi & Izakaya', tagline: 'Precision. Tradition. Umami.',
    headline: 'Sushi Crafted the Edomae Way',
    subheadline: 'Daily flown-in seafood, hand-pressed nigiri, and an intimate omakase counter experience.',
    about: 'Trained in Tokyo\'s Tsukiji tradition, our head chef sources fish daily and ages each cut precisely to its peak. Every piece of nigiri is pressed to order — never pre-made, never rushed.',
    services: [
      { name: 'Chef\'s Omakase Experience', desc: '12-piece seasonal omakase selected fresh by the chef that day.', price: '$95' },
      { name: 'Premium Nigiri Set', desc: 'Eight-piece selection of seasonal nigiri including bluefin tuna and uni.', price: '$58' },
      { name: 'Izakaya Small Plates', desc: 'Grilled skewers, agedashi tofu, and tempura for sharing.', price: 'From $12' },
      { name: 'Sake Pairing Flight', desc: 'Three premium sake pours matched to your meal course.', price: '$35' },
    ],
    stats: [{ value: 'Daily', label: 'Fresh Fish Flights' }, { value: '12yr', label: 'Head Chef Experience' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Kenji R.', rating: 5, text: 'Closest thing to Tokyo-quality sushi I have found outside Japan. The omakase is worth every dollar.', date: 'Dec 2025' },
      { name: 'Amelia S.', rating: 5, text: 'The nigiri texture is unreal — clearly pressed fresh, not pre-made like most places.', date: 'Nov 2025' },
      { name: 'Brett W.', rating: 5, text: 'Sake pairing elevated the whole meal. Intimate counter seating made it feel special.', date: 'Oct 2025' },
    ],
    address: '8 Edomae Lane, Sydney CBD NSW', phone: '+61 2 9027 2020', email: 'reserve@morisushi.com', hours: 'Tue–Sun 5:30pm–10pm'
  },
  'ice-cream-shop': {
    name: 'Frostbite Artisan Gelato', tagline: 'Churned Small. Tasted Big.',
    headline: 'Gelato Made the Old-World Way',
    subheadline: 'Small-batch gelato churned daily with real fruit, Belgian chocolate, and zero artificial flavor.',
    about: 'We churn in batches of just 5 liters at a time, using a traditional Italian base with less air and less sugar than typical ice cream. The result: denser, more intensely flavored gelato.',
    services: [
      { name: 'Classic Gelato Scoop (2 flavors)', desc: 'Choose any two flavors from our daily rotating selection of 16.', price: '$8' },
      { name: 'Affogato', desc: 'A scoop of vanilla bean gelato drowned in a hot double espresso shot.', price: '$7' },
      { name: 'Sorbetto (Dairy-Free)', desc: 'Fruit-forward dairy-free sorbet made with seasonal in-season fruit.', price: '$7' },
      { name: 'Gelato Cake (Custom Order)', desc: 'Layered gelato cake made to order, 48-hour notice required.', price: 'From $55' },
    ],
    stats: [{ value: '16', label: 'Daily Flavors' }, { value: '5L', label: 'Small Batches' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Zoe H.', rating: 5, text: 'The pistachio gelato here tastes like actual pistachios, not green sugar. Amazing.', date: 'Dec 2025' },
      { name: 'Marco T.', rating: 5, text: 'Closest thing to real Italian gelato I have found in this country.', date: 'Nov 2025' },
      { name: 'Lily F.', rating: 5, text: 'Ordered a gelato cake for my daughter\'s birthday — it stole the whole party.', date: 'Oct 2025' },
    ],
    address: '27 Frost Lane, Bondi Beach NSW', phone: '+61 2 9028 2121', email: 'hello@frostbitegelato.com', hours: 'Daily 11am–10pm'
  },

  // ── RETAIL / BOUTIQUE (6) ─────────────────────────────────────────────────────
  'florist': {
    name: 'Bella Bloom Florist', tagline: 'Earthy. Wild. Beautiful.',
    headline: 'Artisanal Florals, Freshly Cut Daily',
    subheadline: 'Bespoke bouquets, wedding installations, and weekly office flower deliveries.',
    about: 'We celebrate the organic geometry of flowers. Our arrangements feature local and native wildflowers in asymmetrical, earthy compositions that feel alive.',
    services: [
      { name: 'Signature Wildwood Bouquet', desc: 'Eucalyptus, proteas, spray roses, and seasonal botanical highlights.', price: '$75' },
      { name: 'Bespoke Wedding Arch', desc: 'Custom structural floral installations styled on-site with fresh blooms.', price: '$1200' },
      { name: 'Weekly Office Vase', desc: 'Fresh ceramic vase arrangement delivered and set up every Monday.', price: '$55/wk' },
      { name: 'Dried Botanical Wreath', desc: 'Hand-foraged dried botanicals, pampas, and seed pods in a ring.', price: '$95' },
    ],
    stats: [{ value: 'Daily', label: 'Farm Picked' }, { value: 'Native', label: 'Focus' }, { value: '4.9★', label: 'Google Review' }],
    reviews: [
      { name: 'Jessica M.', rating: 5, text: 'The wedding arch was beyond stunning. Guests could not stop talking about it.', date: 'Dec 2025' },
      { name: 'Kate B.', rating: 5, text: 'Our weekly office flowers brighten everyone\'s Monday. Absolutely love them.', date: 'Nov 2025' },
      { name: 'Olivia H.', rating: 5, text: 'Ordered a bouquet for my mum\'s birthday and she cried. Perfect.', date: 'Oct 2025' },
    ],
    address: '44 Garden Row, Newtown NSW', phone: '+61 2 9014 6666', email: 'hello@bellabloom.com', hours: 'Mon–Sat 8am–5pm'
  },
  'jewellery': {
    name: 'Aurelia Fine Jewellery', tagline: 'Heirlooms in the Making.',
    headline: 'Jewellery Designed to Outlast Trends',
    subheadline: 'Custom engagement rings, ethically sourced diamonds, and in-house remodeling services.',
    about: 'Every piece at Aurelia is designed and set by our in-house goldsmiths. We work exclusively with conflict-free diamonds and recycled precious metals, building jewellery meant to be passed down.',
    services: [
      { name: 'Custom Engagement Ring Design', desc: 'Full consultation, 3D render, and hand-set diamond or gemstone of your choice.', price: 'From $2,800' },
      { name: 'Heirloom Remodeling', desc: 'Transform inherited gold or stones into a modern piece you will actually wear.', price: 'From $450' },
      { name: 'Diamond Stud Earrings', desc: 'Ethically sourced round-brilliant diamonds in 18k gold settings.', price: 'From $890' },
      { name: 'Jewellery Repair & Resizing', desc: 'Professional resizing, prong retipping, and chain repair.', price: 'From $40' },
    ],
    stats: [{ value: 'Conflict-Free', label: 'Diamond Sourcing' }, { value: '20yr', label: 'Goldsmith Experience' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Victoria L.', rating: 5, text: 'My engagement ring is exactly what I dreamed of, designed from scratch with them.', date: 'Dec 2025' },
      { name: 'Henry C.', rating: 5, text: 'They remade my grandmother\'s ring into something I wear every day. So emotional.', date: 'Nov 2025' },
      { name: 'Sophia R.', rating: 5, text: 'Transparent about sourcing and pricing, no upselling pressure at all. Refreshing.', date: 'Oct 2025' },
    ],
    address: '5 Heritage Arcade, Sydney CBD NSW', phone: '+61 2 9029 2222', email: 'enquiries@aureliafine.com', hours: 'Mon–Sat 10am–6pm'
  },
  'boutique-clothing': {
    name: 'Maison Luxe Boutique', tagline: 'Considered Pieces. Quiet Luxury.',
    headline: 'Wardrobe Staples That Actually Last',
    subheadline: 'Hand-selected designer pieces, tailored fits, and a personal styling service for every visit.',
    about: 'Maison Luxe curates a tightly edited collection of timeless, well-made pieces from independent and emerging designers — no fast fashion, no fleeting trends, just clothing built to last seasons.',
    services: [
      { name: 'Personal Styling Session', desc: 'One-on-one styling appointment with a curated capsule wardrobe pull.', price: '$80 (credited to purchase)' },
      { name: 'In-House Tailoring', desc: 'Professional alterations for the perfect fit on any piece purchased.', price: 'From $35' },
      { name: 'Seasonal Capsule Edit', desc: 'A pre-styled 8-piece capsule wardrobe delivered each new season.', price: 'From $650' },
      { name: 'VIP Styling Membership', desc: 'Quarterly styling sessions plus early access to new designer drops.', price: '$120/quarter' },
    ],
    stats: [{ value: '30+', label: 'Independent Designers' }, { value: 'Hand', label: 'Curated Collection' }, { value: '4.8★', label: 'Google Rating' }],
    reviews: [
      { name: 'Charlotte W.', rating: 5, text: 'The styling session completely changed how I shop. Every piece they picked, I still wear.', date: 'Dec 2025' },
      { name: 'Maxwell J.', rating: 5, text: 'Found pieces here I have not seen anywhere else. Genuinely unique collection.', date: 'Nov 2025' },
      { name: 'Ella P.', rating: 4, text: 'In-house tailoring made a $300 jacket fit like it was made for me.', date: 'Oct 2025' },
    ],
    address: '62 Atelier Walk, Paddington NSW', phone: '+61 2 9030 2323', email: 'style@maisonluxe.com', hours: 'Mon–Sat 10am–6pm, Sun 11am–4pm'
  },
  'clothing': {
    name: 'Northside Streetwear Co.', tagline: 'Everyday Fits. Real Comfort.',
    headline: 'Streetwear Built for Actual Life',
    subheadline: 'Affordable everyday essentials, limited weekly drops, and a fit for every body type.',
    about: 'Northside is built around accessible streetwear that does not sacrifice quality for price. We restock weekly, run limited capsule drops, and keep sizing genuinely inclusive — XS to 4XL, always in stock.',
    services: [
      { name: 'Essentials Bundle (3 Tees)', desc: 'Heavyweight cotton tees in your choice of 3 core colors.', price: '$65' },
      { name: 'Weekly Capsule Drop', desc: 'Limited-run designs released every Friday, restocked rarely.', price: 'From $45' },
      { name: 'Custom Embroidery Add-On', desc: 'Add personalized embroidery to any hoodie or jacket purchase.', price: '+$15' },
      { name: 'Style Box Subscription', desc: 'Monthly curated box of 3 pieces matched to your size and style.', price: '$89/mo' },
    ],
    stats: [{ value: 'XS–4XL', label: 'Inclusive Sizing' }, { value: 'Weekly', label: 'New Drops' }, { value: '4.7★', label: 'Customer Rating' }],
    reviews: [
      { name: 'Jaylen R.', rating: 5, text: 'Finally a streetwear brand that actually fits past a size large. Quality is solid too.', date: 'Dec 2025' },
      { name: 'Mia T.', rating: 5, text: 'The Friday drops sell out so fast but the quality is genuinely worth chasing.', date: 'Nov 2025' },
      { name: 'Cody B.', rating: 4, text: 'Style box has introduced me to combos I never would have picked myself.', date: 'Oct 2025' },
    ],
    address: '101 Northside Mall, Parramatta NSW', phone: '+61 2 9031 2424', email: 'support@northsidestreet.com', hours: 'Daily 10am–9pm'
  },
  'pet-shop': {
    name: 'Paws & Whiskers Pet Co.', tagline: 'Everything Your Pet Actually Needs.',
    headline: 'Quality Pet Care, No Filler Products',
    subheadline: 'Premium nutrition, grooming services, and a genuinely knowledgeable team that loves animals.',
    about: 'We only stock food and products we would actually feed our own pets — no fillers, no junk brands. Our team includes a certified pet nutritionist available for free in-store consultations.',
    services: [
      { name: 'Premium Nutrition Consultation', desc: 'Free in-store consultation with our certified pet nutritionist.', price: 'Free' },
      { name: 'Full Grooming Package', desc: 'Bath, brush-out, nail trim, ear cleaning, and breed-specific styling.', price: 'From $55' },
      { name: 'Puppy Starter Kit', desc: 'Curated bundle of food, toys, crate essentials, and training treats.', price: '$120' },
      { name: 'Monthly Subscription Box', desc: 'Personalized toys and treats delivered monthly based on your pet\'s profile.', price: '$39/mo' },
    ],
    stats: [{ value: 'Certified', label: 'In-Store Nutritionist' }, { value: '200+', label: 'Premium Brands Stocked' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Holly N.', rating: 5, text: 'The nutritionist helped me find food that finally fixed my dog\'s allergies. Free, too!', date: 'Dec 2025' },
      { name: 'Brendan K.', rating: 5, text: 'Grooming team is so gentle with my anxious rescue cat. Never an issue.', date: 'Nov 2025' },
      { name: 'Tara S.', rating: 5, text: 'The puppy starter kit had literally everything we needed for our first week home.', date: 'Oct 2025' },
    ],
    address: '14 Companion Plaza, Lane Cove NSW', phone: '+61 2 9032 2525', email: 'hello@pawsandwhiskers.com', hours: 'Daily 9am–7pm'
  },
  'bookshop': {
    name: 'The Cozy Nook Bookshop', tagline: 'A Chapter Waiting to Be Found.',
    headline: 'Independent Books, Curated With Care',
    subheadline: 'Hand-picked fiction, local author spotlights, and a reading nook that invites you to stay a while.',
    about: 'The Cozy Nook is run by readers, for readers. Every title on our shelves has been personally read and recommended by our staff — no algorithm picks, no bestseller-only walls.',
    services: [
      { name: 'Staff-Picked Book Bundle', desc: 'A surprise 3-book bundle hand-selected to match your favorite genres.', price: '$55' },
      { name: 'Local Author Signing Event', desc: 'Monthly in-store signing and reading events with regional authors.', price: 'Free entry' },
      { name: 'Book Club Membership', desc: 'Monthly themed pick plus discussion night and 10% off all purchases.', price: '$25/mo' },
      { name: 'Gift Wrapping & Personalization', desc: 'Hand-wrapped gifting with a custom handwritten note card.', price: '+$5' },
    ],
    stats: [{ value: 'Staff', label: 'Curated Shelves' }, { value: 'Monthly', label: 'Author Events' }, { value: '4.9★', label: 'Google Rating' }],
    reviews: [
      { name: 'Margaret O.', rating: 5, text: 'Every staff recommendation has been a five-star read for me. They just get it.', date: 'Dec 2025' },
      { name: 'Felix A.', rating: 5, text: 'The book club introduced me to authors I never would have found on my own.', date: 'Nov 2025' },
      { name: 'Diana W.', rating: 5, text: 'Such a warm, cozy space. I came for a book and stayed for two hours reading.', date: 'Oct 2025' },
    ],
    address: '9 Pageturner Lane, Glebe NSW', phone: '+61 2 9033 2626', email: 'hello@cozynookbooks.com', hours: 'Mon–Sat 9am–7pm, Sun 10am–5pm'
  },

  // ── FITNESS (5) ───────────────────────────────────────────────────────────────
  'gym': {
    name: 'Ironworks Athletic Club', tagline: 'Forged in Sweat. Defined by Results.',
    headline: 'State-of-the-Art Training Facility',
    subheadline: 'Heavy steel platforms, custom lifting rigs, and elite performance coaches.',
    about: 'Ironworks is a community dedicated to real training. No gimmicks — just professional barbell equipment, specialty strength gear, and a culture that drives you forward every session.',
    services: [
      { name: 'Elite Club Access Pass', desc: 'Full 24/7 access to heavy steel zone, lifting platforms, and recovery sauna.', price: '$75/mo' },
      { name: 'Small Group Strength Class', desc: 'Structured barbell coaching covering squats, presses, and athletic power moves.', price: '$120/mo' },
      { name: 'Personal Coaching Bundle', desc: 'Four 1-on-1 private training sessions with detailed nutritional planning.', price: '$240' },
      { name: 'Body Composition Analysis', desc: 'DEXA scan, metabolic rate testing, and 12-week transformation roadmap.', price: '$90' },
    ],
    stats: [{ value: '24/7', label: 'Club Access' }, { value: '8', label: 'Lifting Platforms' }, { value: '500+', label: 'Active Members' }],
    reviews: [
      { name: 'Chris M.', rating: 5, text: 'Best gym I have ever trained at. The equipment quality is elite and the coaches actually care.', date: 'Dec 2025' },
      { name: 'Dave W.', rating: 5, text: 'Lost 18kg in 6 months with their personal coaching program. Life-changing results.', date: 'Nov 2025' },
      { name: 'Jake S.', rating: 5, text: 'The 24/7 access is a game changer. Always clean, never overcrowded.', date: 'Oct 2025' },
    ],
    address: '100 Iron Street, Alexandria NSW', phone: '+61 2 9006 7890', email: 'train@ironworksclub.com', hours: 'Open 24/7'
  },
  'yoga-studio': {
    name: 'Prana Flow Yoga', tagline: 'Breathe. Move. Transform.',
    headline: 'Find Your Stillness in Motion',
    subheadline: 'Traditional Vinyasa, heated flow classes, and restorative sound baths.',
    about: 'Prana Flow offers a warm, inclusive space to deepen your practice. We combine expert alignment cues, breath coaching, and deep meditation to transform body and mind.',
    services: [
      { name: 'Vinyasa Flow Class', desc: 'Dynamic movement linked with breath, building strength and focus.', price: '$22' },
      { name: 'Hot Yoga Session', desc: '60 minutes in a heated room, flushing toxins and building flexibility.', price: '$25' },
      { name: 'Restorative Sound Bath', desc: 'Passive holds supported by bolsters, finished with crystal singing bowls.', price: '$28' },
      { name: 'Unlimited Monthly Pass', desc: 'Access all daily classes plus 10% off workshops and retreats.', price: '$140' },
    ],
    stats: [{ value: '20+', label: 'Weekly Classes' }, { value: '500+', label: 'Members' }, { value: '4.9★', label: 'Rating' }],
    reviews: [
      { name: 'Sophia K.', rating: 5, text: 'The sound bath class changed my life. Pure peace. Pure healing.', date: 'Dec 2025' },
      { name: 'Anna L.', rating: 5, text: 'Best yoga studio I have ever attended. Teachers are world-class.', date: 'Nov 2025' },
      { name: 'Mia R.', rating: 5, text: 'Hot yoga here is intense but amazing. I leave feeling reborn every time.', date: 'Oct 2025' },
    ],
    address: '5 Lotus Lane, Bondi NSW', phone: '+61 2 9012 4444', email: 'namaste@pranaflow.com', hours: 'Daily 6am–9pm'
  },
  'personal-trainer': {
    name: 'Apex Athletic Coaching', tagline: 'One Coach. One Plan. Real Results.',
    headline: 'Personal Training That Actually Fits Your Life',
    subheadline: 'One-on-one programming, nutrition coaching, and flexible in-home or studio sessions.',
    about: 'Apex builds programs around your actual schedule, injuries, and goals — not a one-size-fits-all template. Every client gets a dedicated coach who tracks progress weekly and adjusts in real time.',
    services: [
      { name: 'Initial Assessment & Goal Plan', desc: 'Movement screening, goal-setting session, and a custom 12-week roadmap.', price: '$85' },
      { name: '1-on-1 Coaching Session', desc: 'Fully personalized session with form correction and progressive overload tracking.', price: '$90' },
      { name: 'In-Home Training Package', desc: 'Eight sessions delivered at your home with all equipment provided.', price: '$680' },
      { name: 'Nutrition Coaching Add-On', desc: 'Weekly check-ins, macro planning, and habit coaching alongside training.', price: '$60/wk' },
    ],
    stats: [{ value: '4.9★', label: 'Client Rating' }, { value: '10yr', label: 'Coaching Experience' }, { value: '300+', label: 'Transformations' }],
    reviews: [
      { name: 'Brad O.', rating: 5, text: 'First trainer who actually worked around my shoulder injury instead of ignoring it.', date: 'Dec 2025' },
      { name: 'Naomi T.', rating: 5, text: 'Down 14kg and stronger than I have ever been. The accountability made all the difference.', date: 'Nov 2025' },
      { name: 'Sam K.', rating: 5, text: 'In-home sessions fit perfectly around my crazy work schedule. Highly recommend.', date: 'Oct 2025' },
    ],
    address: '12 Performance Plaza, Manly NSW', phone: '+61 2 9034 2727', email: 'coach@apexathletic.com', hours: 'Mon–Sat 6am–8pm, by appointment'
  },
  'pilates': {
    name: 'Form & Line Pilates Studio', tagline: 'Strength From the Inside Out.',
    headline: 'Reformer Pilates for Real Core Strength',
    subheadline: 'Small reformer classes, clinical Pilates rehab, and posture-focused programming.',
    about: 'Form & Line keeps classes capped at six people so every instructor can actually correct your form in real time. Our reformer-based method builds deep core strength while protecting joints.',
    services: [
      { name: 'Reformer Group Class', desc: 'Small-group reformer session capped at 6 people for hands-on instruction.', price: '$38' },
      { name: 'Clinical Pilates (Rehab)', desc: '1-on-1 session designed around injury recovery with a physio-trained instructor.', price: '$95' },
      { name: 'Beginner Foundations Course', desc: 'Four-week intro course covering reformer fundamentals and breathing technique.', price: '$180' },
      { name: 'Unlimited Monthly Membership', desc: 'Unlimited reformer classes plus priority booking for popular time slots.', price: '$220/mo' },
    ],
    stats: [{ value: '6', label: 'Max Class Size' }, { value: '4.9★', label: 'Studio Rating' }, { value: '8yr', label: 'Studio Experience' }],
    reviews: [
      { name: 'Claire D.', rating: 5, text: 'The small class size means the instructor actually notices when my form is off. Real difference.', date: 'Dec 2025' },
      { name: 'Ryan P.', rating: 5, text: 'Clinical Pilates helped my lower back more than six months of physio did. Incredible.', date: 'Nov 2025' },
      { name: 'Tara M.', rating: 5, text: 'My posture has genuinely improved after two months of classes here. Worth every cent.', date: 'Oct 2025' },
    ],
    address: '21 Studio Row, Mosman NSW', phone: '+61 2 9035 2828', email: 'hello@formandline.com', hours: 'Mon–Fri 6am–7pm, Sat 8am–1pm'
  },
  'martial-arts': {
    name: 'Apex Martial Arts Academy', tagline: 'Discipline. Respect. Strength.',
    headline: 'Martial Arts for Every Age and Goal',
    subheadline: 'Brazilian Jiu-Jitsu, Muay Thai, and kids\' confidence-building classes from world-class coaches.',
    about: 'Apex Academy trains everyone from total beginners to competing athletes. Our coaches have decades of combined competition experience, and our kids program is built around discipline and confidence, not just technique.',
    services: [
      { name: 'BJJ Fundamentals Class', desc: 'Beginner-friendly Brazilian Jiu-Jitsu class covering core positions and submissions.', price: '$30/class' },
      { name: 'Muay Thai Conditioning', desc: 'High-intensity striking class combining technique with conditioning work.', price: '$30/class' },
      { name: 'Kids Confidence Program', desc: 'Ages 6-12 program building discipline, focus, and anti-bullying confidence.', price: '$120/mo' },
      { name: 'Unlimited Adult Membership', desc: 'Unlimited access to all adult BJJ and Muay Thai classes.', price: '$190/mo' },
    ],
    stats: [{ value: '15yr', label: 'Head Coach Experience' }, { value: '4.9★', label: 'Member Rating' }, { value: '400+', label: 'Active Students' }],
    reviews: [
      { name: 'Tyler S.', rating: 5, text: 'My son\'s confidence has completely transformed since starting the kids program. Amazing coaches.', date: 'Dec 2025' },
      { name: 'Diego F.', rating: 5, text: 'The BJJ coaching here is world-class. Learned more in 3 months than a year elsewhere.', date: 'Nov 2025' },
      { name: 'Rachel N.', rating: 5, text: 'Muay Thai classes are intense but the coaches genuinely care about safe technique.', date: 'Oct 2025' },
    ],
    address: '33 Dojo Lane, Marrickville NSW', phone: '+61 2 9036 2929', email: 'train@apexmartialarts.com', hours: 'Mon–Sat 6am–9pm'
  },

  // ── LEGAL / FINANCE (5) ───────────────────────────────────────────────────────
  'law-firm': {
    name: 'Apex Legal Partners', tagline: 'Relentless Representation.',
    headline: 'High-Stakes Legal Representation',
    subheadline: 'Expert commercial litigation, corporate advisory, and asset protection lawyers.',
    about: 'Apex Legal Partners brings commercial focus and deep litigious experience to resolve complex matters efficiently. We protect your assets and secure your most important transactions.',
    services: [
      { name: 'Corporate Advisory Services', desc: 'Joint venture structures, risk mitigation, and compliance frameworks.', price: '$350/hr' },
      { name: 'Commercial Litigation Strategy', desc: 'High-stakes dispute analysis, court representation, and arbitration.', price: '$400/hr' },
      { name: 'Asset Protection Consult', desc: 'Establishment of trusts, offshore structuring, and corporate shielding.', price: '$500/hr' },
      { name: 'Contract Review & Drafting', desc: 'Thorough review and drafting of commercial agreements and NDAs.', price: '$280/hr' },
    ],
    stats: [{ value: '$500M+', label: 'Deals Closed' }, { value: '92%', label: 'Litigation Success' }, { value: '25yr+', label: 'History' }],
    reviews: [
      { name: 'David C.', rating: 5, text: 'Apex handled our merger with absolute precision. Their commercial instincts are second to none.', date: 'Dec 2025' },
      { name: 'Sandra M.', rating: 5, text: 'Won a complex dispute that two other firms said was impossible. Truly relentless advocates.', date: 'Nov 2025' },
      { name: 'Peter L.', rating: 5, text: 'The asset protection structures they set up for us have been invaluable.', date: 'Oct 2025' },
    ],
    address: '1 Martin Place, Level 42, Sydney NSW', phone: '+61 2 9009 1111', email: 'matters@apexlegal.com', hours: 'Mon–Fri 8am–6pm'
  },
  'accounting': {
    name: 'Vanguard Tax & Audit', tagline: 'Precision Numbers. Honest Advice.',
    headline: 'Accounting That Actually Saves You Money',
    subheadline: 'Tax planning, business advisory, and audit services for growing businesses and individuals.',
    about: 'Vanguard goes beyond compliance — we proactively plan with clients throughout the year to legally minimize tax and improve cash flow, not just file paperwork once a year.',
    services: [
      { name: 'Individual Tax Return', desc: 'Comprehensive personal tax return with deduction maximization review.', price: 'From $180' },
      { name: 'Business Tax Planning', desc: 'Quarterly strategic tax planning sessions to legally minimize liability.', price: '$250/session' },
      { name: 'BAS & Bookkeeping Service', desc: 'Monthly bookkeeping and quarterly BAS lodgment, fully managed.', price: 'From $220/mo' },
      { name: 'Business Structure Advisory', desc: 'Trust, company, or partnership structuring for tax efficiency and asset protection.', price: '$450' },
    ],
    stats: [{ value: '20yr', label: 'Firm Experience' }, { value: '500+', label: 'Business Clients' }, { value: '4.9★', label: 'Client Rating' }],
    reviews: [
      { name: 'Patricia W.', rating: 5, text: 'Their tax planning saved my business over $30,000 last financial year. Genuinely proactive advice.', date: 'Dec 2025' },
      { name: 'Greg H.', rating: 5, text: 'Finally an accountant who explains things in plain English and actually returns calls.', date: 'Nov 2025' },
      { name: 'Monica F.', rating: 5, text: 'Restructured my business entity and the tax savings paid for their fee within months.', date: 'Oct 2025' },
    ],
    address: '88 Ledger Lane, North Sydney NSW', phone: '+61 2 9037 3030', email: 'advice@vanguardtax.com', hours: 'Mon–Fri 8:30am–5:30pm'
  },
  'financial-advisor': {
    name: 'Beacon Wealth Advisory', tagline: 'Clarity for Every Stage of Wealth.',
    headline: 'Financial Advice Built Around Your Life',
    subheadline: 'Retirement planning, investment strategy, and superannuation advice from independent advisors.',
    about: 'Beacon is fee-for-service and product-independent — we are not paid commissions to recommend specific funds. Our only incentive is building a plan that genuinely works for your goals.',
    services: [
      { name: 'Comprehensive Financial Plan', desc: 'Full review of assets, goals, and risk profile resulting in a written strategy.', price: '$1,500' },
      { name: 'Retirement Income Strategy', desc: 'Pension drawdown planning to maximize retirement income longevity.', price: '$800' },
      { name: 'Superannuation Review', desc: 'Fee, performance, and insurance audit across your current super fund.', price: '$350' },
      { name: 'Ongoing Advice Membership', desc: 'Quarterly portfolio reviews and unlimited advisor check-ins.', price: '$280/mo' },
    ],
    stats: [{ value: 'Fee-Only', label: 'Independent Advice' }, { value: '$200M+', label: 'Assets Advised' }, { value: '4.9★', label: 'Client Rating' }],
    reviews: [
      { name: 'Robert T.', rating: 5, text: 'First advisor who clearly was not just pushing me toward commission-based products. Trustworthy.', date: 'Dec 2025' },
      { name: 'Joanne K.', rating: 5, text: 'The super review found $40,000 in unnecessary fees over 10 years. Eye-opening.', date: 'Nov 2025' },
      { name: 'Bill S.', rating: 5, text: 'Retirement plan they built gives me genuine confidence I will not run out of money.', date: 'Oct 2025' },
    ],
    address: '17 Beacon Tower, Sydney CBD NSW', phone: '+61 2 9038 3131', email: 'plan@beaconwealth.com', hours: 'Mon–Fri 9am–5:30pm'
  },
  'real-estate': {
    name: 'Maison Real Estate', tagline: 'Connecting People with Fine Homes.',
    headline: 'Bespoke Property Brokerage',
    subheadline: 'Exclusive off-market residential estates, modern penthouses, and premium property management.',
    about: 'Maison represents the most exclusive real estate listings in the region. We offer professional negotiations, high-definition marketing campaigns, and white-glove client service.',
    services: [
      { name: 'Exclusive Seller Representation', desc: 'Staging advice, architectural photography, off-market targeting, and close.', price: 'From 1.5%' },
      { name: 'Private Buyer Concierge', desc: 'Access to off-market properties, price analysis, and full transaction management.', price: 'Free' },
      { name: 'Premium Property Management', desc: 'Tenant vetting, rental collections, routine inspections, and maintenance.', price: '7% of rent' },
      { name: 'Property Valuation Report', desc: 'Comprehensive market analysis and professional property valuation.', price: '$350' },
    ],
    stats: [{ value: '$250M+', label: 'Sales Volume' }, { value: '18d', label: 'Avg Days on Market' }, { value: '4.9★', label: 'Client Rating' }],
    reviews: [
      { name: 'Catherine W.', rating: 5, text: 'Maison sold our home $120k above asking price. Their marketing is in a league of its own.', date: 'Dec 2025' },
      { name: 'Robert H.', rating: 5, text: 'Found us our dream home off-market. The concierge service is genuinely exceptional.', date: 'Nov 2025' },
      { name: 'Lucy F.', rating: 5, text: 'As a first-time buyer, they made the whole process stress-free and transparent.', date: 'Oct 2025' },
    ],
    address: '1 Harbour View, Kirribilli NSW', phone: '+61 2 9008 6789', email: 'luxury@maisonre.com', hours: 'Mon–Sat 8am–6pm'
  },
  'insurance': {
    name: 'Shield Mutual Insurance Advisory', tagline: 'Protection That Actually Pays Out.',
    headline: 'Insurance Advice, Not Just Policy Sales',
    subheadline: 'Independent life, income protection, and business insurance advice across every major insurer.',
    about: 'Shield Mutual compares policies across the entire market rather than pushing one insurer\'s products. We are also there at claim time — most clients never hear from their insurance broker again after signing, we are different.',
    services: [
      { name: 'Income Protection Review', desc: 'Full comparison of income protection policies across 12+ insurers.', price: 'Free quote' },
      { name: 'Life Insurance Consultation', desc: 'Needs analysis and tailored life insurance recommendation.', price: 'Free quote' },
      { name: 'Business Insurance Package', desc: 'Public liability, professional indemnity, and asset cover bundled for SMEs.', price: 'From $80/mo' },
      { name: 'Claims Advocacy Support', desc: 'We manage your claim paperwork and insurer negotiations on your behalf.', price: 'No extra charge' },
    ],
    stats: [{ value: '12+', label: 'Insurers Compared' }, { value: '95%', label: 'Claims Approved' }, { value: '4.8★', label: 'Client Rating' }],
    reviews: [
      { name: 'Karen J.', rating: 5, text: 'When I actually needed to claim, they handled everything. Made a stressful time so much easier.', date: 'Dec 2025' },
      { name: 'Anthony R.', rating: 5, text: 'Found me a better income protection policy for $40 less per month. Should have called sooner.', date: 'Nov 2025' },
      { name: 'Diane M.', rating: 5, text: 'Business insurance package was straightforward and saved us from being underinsured.', date: 'Oct 2025' },
    ],
    address: '24 Assurance Avenue, North Sydney NSW', phone: '+61 2 9039 3232', email: 'advice@shieldmutual.com', hours: 'Mon–Fri 9am–5pm'
  },

  // ── CREATIVE / TRADES (9) ──────────────────────────────────────────────────────
  'web-agency': {
    name: 'Futurxt Digital Solutions', tagline: 'Fast Code. Flawless Design.',
    headline: 'Next-Generation Web Development',
    subheadline: 'Blazing-fast React apps, Next.js setups, and high-performance digital experiences.',
    about: 'We build web experiences that convert. Merging high-end visual aesthetics with optimal code architecture, we help brands dominate their markets online.',
    services: [
      { name: 'Custom Next.js Web App', desc: 'Server components, tailored CMS, dynamic database, and global CDN.', price: '$8,000' },
      { name: 'E-Commerce Platform', desc: 'Headless commerce integration, payment security, and instant loading.', price: '$12,000' },
      { name: 'UI/UX Design Sprint', desc: 'Interactive Figma wireframing, user-testing flows, and visual design.', price: '$3,500' },
      { name: 'SEO & Performance Audit', desc: 'Full technical audit, Core Web Vitals fix, and content strategy plan.', price: '$1,500' },
    ],
    stats: [{ value: '<1s', label: 'Page Load Speed' }, { value: '100', label: 'Lighthouse Score' }, { value: '35+', label: 'Active Projects' }],
    reviews: [
      { name: 'Liam O.', rating: 5, text: 'Our new site loads in 0.6 seconds and our conversions went up 240%. Unreal results.', date: 'Dec 2025' },
      { name: 'Zara A.', rating: 5, text: 'The design sprint they ran transformed our brand presence completely. Worth every dollar.', date: 'Nov 2025' },
      { name: 'Tom B.', rating: 5, text: 'Best dev team we have ever worked with. On time, on budget, and incredibly talented.', date: 'Oct 2025' },
    ],
    address: '88 Tech Hub, Ultimo NSW', phone: '+61 2 9010 2222', email: 'hello@futurxt.com', hours: 'Mon–Fri 9am–6pm'
  },
  'photography': {
    name: 'Aperture Fine Art Photography', tagline: 'Capturing Truth in Light.',
    headline: 'Editorial Portrait & Brand Photography',
    subheadline: 'High-end studio sessions, product campaigns, and organic wedding storytelling.',
    about: 'We use natural light and rich shadows to capture genuine emotion. No stiff poses — clean, timeless editorial framing that tells your story beautifully.',
    services: [
      { name: 'Studio Portrait Session', desc: '2 hours, 3 outfit changes, premium lighting, and 15 edited files.', price: '$450' },
      { name: 'Brand Product Campaign', desc: 'High-detail styling, macro shots, clean color correction, and catalog prep.', price: '$750' },
      { name: 'Wedding Day Coverage', desc: '8 hours documentary-style coverage, print box, and online gallery.', price: '$2,800' },
      { name: 'Content Creator Pack', desc: 'Monthly lifestyle shoot, 30+ edited images for social channels.', price: '$600' },
    ],
    stats: [{ value: '15yr', label: 'Experience' }, { value: 'Top 50', label: 'Editorial Award' }, { value: '4.9★', label: 'Rating' }],
    reviews: [
      { name: 'Claire H.', rating: 5, text: 'The wedding photos made me cry. Every single frame is perfect.', date: 'Dec 2025' },
      { name: 'Brendan L.', rating: 5, text: 'Our brand campaign photos tripled our engagement rate. Incredible work.', date: 'Nov 2025' },
      { name: 'Amy S.', rating: 5, text: 'Portrait session was so fun and relaxed. The results blew my mind.', date: 'Oct 2025' },
    ],
    address: '18 Lens Lane, Surry Hills NSW', phone: '+61 2 9013 5555', email: 'shoot@aperturefine.com', hours: 'Mon–Sat 9am–6pm'
  },
  'graphic-design': {
    name: 'Chroma Design Studio', tagline: 'Visual Identity, Sharpened.',
    headline: 'Branding That Actually Gets Remembered',
    subheadline: 'Logo design, full brand systems, and packaging design for businesses ready to stand out.',
    about: 'Chroma builds complete visual identity systems — not just a logo, but a cohesive language across packaging, digital, and print that makes your brand instantly recognizable.',
    services: [
      { name: 'Logo & Brand Identity', desc: 'Logo suite, color palette, typography system, and brand guidelines document.', price: '$2,200' },
      { name: 'Packaging Design Package', desc: 'Custom packaging design across up to 3 product SKUs, print-ready files.', price: '$1,800' },
      { name: 'Social Media Brand Kit', desc: 'Templated post designs, story templates, and highlight covers matched to your brand.', price: '$650' },
      { name: 'Pitch Deck Design', desc: 'Investor-ready slide deck design built around your existing content.', price: '$900' },
    ],
    stats: [{ value: '120+', label: 'Brands Designed' }, { value: '4.9★', label: 'Client Rating' }, { value: '9yr', label: 'Studio Experience' }],
    reviews: [
      { name: 'Sienna P.', rating: 5, text: 'Our rebrand led directly to a 60% increase in social engagement. Stunning work.', date: 'Dec 2025' },
      { name: 'Marcus D.', rating: 5, text: 'The packaging design they created got us picked up by two new retailers. Incredible ROI.', date: 'Nov 2025' },
      { name: 'Ivy R.', rating: 5, text: 'Pitch deck design helped us close our seed round. Investors specifically complimented it.', date: 'Oct 2025' },
    ],
    address: '40 Palette Plaza, Chippendale NSW', phone: '+61 2 9040 3333', email: 'studio@chromadesign.com', hours: 'Mon–Fri 9am–6pm'
  },
  'electrician': {
    name: 'VoltGuard Electrical Services', tagline: 'Wired Right. Every Time.',
    headline: 'Licensed Electricians You Can Trust',
    subheadline: 'Residential rewiring, switchboard upgrades, and emergency electrical repairs.',
    about: 'VoltGuard is fully licensed and insured, with every job backed by a written warranty. We show up on time, quote upfront with no hidden fees, and leave every job site spotless.',
    services: [
      { name: 'Switchboard Upgrade', desc: 'Full switchboard replacement with safety switches and circuit breakers to current code.', price: 'From $850' },
      { name: 'Emergency Callout', desc: '24/7 emergency electrical repair, same-day response guaranteed.', price: 'From $150' },
      { name: 'Home Rewiring', desc: 'Complete or partial home rewiring with minimal disruption to your space.', price: 'Quote on inspection' },
      { name: 'Electrical Safety Inspection', desc: 'Full property safety check with detailed report and compliance certificate.', price: '$180' },
    ],
    stats: [{ value: 'Licensed', label: '& Fully Insured' }, { value: '24/7', label: 'Emergency Service' }, { value: '4.9★', label: 'Customer Rating' }],
    reviews: [
      { name: 'Wayne T.', rating: 5, text: 'Came out at 11pm for a power emergency and fixed it in 40 minutes. Lifesavers.', date: 'Dec 2025' },
      { name: 'Julie B.', rating: 5, text: 'Upfront quote, no surprises on the invoice. Such a relief compared to past electricians.', date: 'Nov 2025' },
      { name: 'Frank S.', rating: 5, text: 'Switchboard upgrade was done in half a day and the work is immaculate.', date: 'Oct 2025' },
    ],
    address: '55 Circuit Street, Bankstown NSW', phone: '+61 2 9041 3434', email: 'jobs@voltguardelectrical.com', hours: 'Mon–Sat 7am–6pm, Emergency 24/7'
  },
  'plumber': {
    name: 'FlowRight Plumbing Co.', tagline: 'No Leaks. No Excuses.',
    headline: 'Reliable Plumbing, Done Right the First Time',
    subheadline: 'Blocked drains, hot water systems, and emergency leak repairs across the region.',
    about: 'FlowRight has built a reputation on showing up when promised and fixing it properly the first time — no callbacks, no shortcuts. Every plumber is fully licensed with upfront written quotes.',
    services: [
      { name: 'Blocked Drain Clearing', desc: 'CCTV drain inspection and high-pressure jet clearing for stubborn blockages.', price: 'From $180' },
      { name: 'Hot Water System Replacement', desc: 'Same-day installation of gas, electric, or heat pump hot water systems.', price: 'From $1,200' },
      { name: 'Emergency Leak Repair', desc: '24/7 emergency response for burst pipes and major leaks.', price: 'From $150' },
      { name: 'Bathroom Plumbing Renovation', desc: 'Full repipe and fixture installation for bathroom renovation projects.', price: 'Quote on inspection' },
    ],
    stats: [{ value: 'Licensed', label: 'Master Plumbers' }, { value: '24/7', label: 'Emergency Callout' }, { value: '4.9★', label: 'Customer Rating' }],
    reviews: [
      { name: 'Gary M.', rating: 5, text: 'Hot water died on a Sunday and they had a new system installed by that afternoon.', date: 'Dec 2025' },
      { name: 'Donna K.', rating: 5, text: 'Drain has been blocked three times by other plumbers. FlowRight actually fixed the root cause.', date: 'Nov 2025' },
      { name: 'Tony R.', rating: 5, text: 'Upfront pricing before any work started. Refreshingly honest compared to past experiences.', date: 'Oct 2025' },
    ],
    address: '67 Pipeline Road, Liverpool NSW', phone: '+61 2 9042 3535', email: 'jobs@flowrightplumbing.com', hours: 'Mon–Sat 6am–7pm, Emergency 24/7'
  },
  'landscaping': {
    name: 'GreenScapes Design & Build', tagline: 'Gardens Built to Outlast Trends.',
    headline: 'Landscape Design That Transforms Your Outdoor Space',
    subheadline: 'Custom garden design, turf installation, and full outdoor renovation builds.',
    about: 'GreenScapes designs landscapes around how you actually live outdoors — entertaining, relaxing, or growing your own food. Every design is climate-appropriate and built for low long-term maintenance.',
    services: [
      { name: 'Garden Design Consultation', desc: 'On-site consultation and 3D landscape design concept for your property.', price: '$250' },
      { name: 'Turf Installation', desc: 'Full site prep, premium turf supply, and professional installation.', price: 'From $25/sqm' },
      { name: 'Outdoor Entertainment Build', desc: 'Custom decking, pergola, and garden lighting design and build.', price: 'Quote on inspection' },
      { name: 'Garden Maintenance Plan', desc: 'Fortnightly mowing, edging, and seasonal pruning service.', price: 'From $90/visit' },
    ],
    stats: [{ value: '4.9★', label: 'Customer Rating' }, { value: '14yr', label: 'Design Experience' }, { value: '600+', label: 'Gardens Built' }],
    reviews: [
      { name: 'Susan P.', rating: 5, text: 'Transformed our backyard from a mud patch into something out of a magazine. Stunning.', date: 'Dec 2025' },
      { name: 'Mark F.', rating: 5, text: 'The deck and pergola build exceeded what we imagined. Quality craftsmanship throughout.', date: 'Nov 2025' },
      { name: 'Wendy H.', rating: 5, text: 'New turf looks incredible and their maintenance plan keeps it looking fresh year-round.', date: 'Oct 2025' },
    ],
    address: '29 Garden Grove Road, Penrith NSW', phone: '+61 2 9043 3636', email: 'design@greenscapesbuild.com', hours: 'Mon–Sat 7am–5pm'
  },
  'cleaning-service': {
    name: 'Sparkle Premium Cleaners', tagline: 'Spotless. Reliable. Trusted.',
    headline: 'Professional Cleaning You Can Actually Rely On',
    subheadline: 'Recurring home cleaning, end-of-lease cleans, and fully insured commercial cleaning teams.',
    about: 'Every Sparkle cleaner is police-checked, fully insured, and trained to our exact 40-point checklist — so every clean is consistent, whether it is your first visit or your fiftieth.',
    services: [
      { name: 'Recurring Home Clean', desc: 'Weekly or fortnightly clean covering kitchen, bathrooms, and all living areas.', price: 'From $120/visit' },
      { name: 'End-of-Lease Deep Clean', desc: 'Comprehensive bond-back guaranteed clean including ovens and windows.', price: 'From $280' },
      { name: 'Commercial Office Cleaning', desc: 'After-hours office cleaning with flexible scheduling for businesses.', price: 'Quote on inspection' },
      { name: 'One-Off Deep Clean', desc: 'Top-to-bottom deep clean for move-ins, special occasions, or spring cleaning.', price: 'From $220' },
    ],
    stats: [{ value: 'Police-Checked', label: 'All Cleaners' }, { value: '100%', label: 'Bond-Back Guarantee' }, { value: '4.9★', label: 'Customer Rating' }],
    reviews: [
      { name: 'Angela V.', rating: 5, text: 'Got my full bond back thanks to their end-of-lease clean. Worth every dollar.', date: 'Dec 2025' },
      { name: 'Steven L.', rating: 5, text: 'Same two cleaners every fortnight, always thorough, always on time. Genuinely reliable.', date: 'Nov 2025' },
      { name: 'Rebecca J.', rating: 5, text: 'Our office has never looked better. The team is professional and discreet after hours.', date: 'Oct 2025' },
    ],
    address: '83 Spotless Street, Parramatta NSW', phone: '+61 2 9044 3737', email: 'bookings@sparklecleaners.com', hours: 'Mon–Sat 7am–6pm'
  },
  'interior-design': {
    name: 'Maison Interior Studio', tagline: 'Spaces That Feel Like You.',
    headline: 'Interior Design for Homes With Real Personality',
    subheadline: 'Full home styling, renovation design consultation, and custom furniture sourcing.',
    about: 'Maison Studio designs around how clients actually live — not just how a space photographs. Every project blends function, comfort, and a genuinely personal aesthetic built to last well beyond trends.',
    services: [
      { name: 'Interior Design Consultation', desc: 'In-home consultation, mood board, and initial design direction.', price: '$280' },
      { name: 'Full Room Styling Package', desc: 'Complete design, furniture sourcing, and styling for one room.', price: 'From $3,500' },
      { name: 'Renovation Design Planning', desc: 'Full floor plan and material selection for kitchen or bathroom renovations.', price: 'From $1,800' },
      { name: 'Custom Furniture Sourcing', desc: 'Bespoke furniture sourcing and procurement matched to your design vision.', price: '10% of spend' },
    ],
    stats: [{ value: '4.9★', label: 'Client Rating' }, { value: '150+', label: 'Homes Styled' }, { value: '11yr', label: 'Studio Experience' }],
    reviews: [
      { name: 'Vanessa K.', rating: 5, text: 'They turned our awkward living room into the favorite room in the house. Genuinely transformative.', date: 'Dec 2025' },
      { name: 'Oliver T.', rating: 5, text: 'The renovation planning saved us from costly mistakes before builders even started.', date: 'Nov 2025' },
      { name: 'Pauline D.', rating: 5, text: 'Every furniture piece they sourced felt curated specifically for our taste. Loved the result.', date: 'Oct 2025' },
    ],
    address: '52 Atelier Court, Woollahra NSW', phone: '+61 2 9045 3838', email: 'studio@maisoninterior.com', hours: 'Mon–Fri 9am–6pm, by appointment'
  },
  'video-production': {
    name: 'Volt Cinema Productions', tagline: 'Stories, Shot to Move People.',
    headline: 'Cinematic Video Production for Brands',
    subheadline: 'Brand films, product launch videos, and social-first content shot and edited in-house.',
    about: 'Volt Cinema treats every brand video like a short film — proper storyboarding, lighting, and sound design, not just a camera pointed at a product. We handle everything from concept to final cut.',
    services: [
      { name: 'Brand Story Film', desc: 'Full concept, filming, and edit of a 2-3 minute cinematic brand story.', price: '$4,500' },
      { name: 'Product Launch Video', desc: 'High-energy product showcase video optimized for social and ads.', price: '$2,800' },
      { name: 'Social Content Bundle', desc: 'One filming day producing 10 short-form videos for social channels.', price: '$1,900' },
      { name: 'Event Coverage & Highlight Reel', desc: 'Full-day event filming with a 90-second highlight reel delivered within 5 days.', price: '$1,600' },
    ],
    stats: [{ value: '4.9★', label: 'Client Rating' }, { value: '200+', label: 'Brand Films Produced' }, { value: '10yr', label: 'Production Experience' }],
    reviews: [
      { name: 'Felix N.', rating: 5, text: 'Our product launch video drove more sales in one week than our entire ad budget last quarter.', date: 'Dec 2025' },
      { name: 'Camille R.', rating: 5, text: 'The brand film they produced gave me chills watching it back. Genuinely cinematic quality.', date: 'Nov 2025' },
      { name: 'Lucas B.', rating: 5, text: 'Event highlight reel was ready in 3 days and captured the night perfectly. Exceeded expectations.', date: 'Oct 2025' },
    ],
    address: '36 Lumière Lane, Alexandria NSW', phone: '+61 2 9046 3939', email: 'produce@voltcinema.com', hours: 'Mon–Fri 9am–6pm, by appointment'
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// TRACKING
// ═══════════════════════════════════════════════════════════════════════════
const _sb_track = typeof window !== 'undefined' ? createSupabaseBrowserClient() : null

async function trackEvent(slug: string, eventType: 'view_demo' | 'contact_click') {
  try {
    if (!_sb_track) return
    const { data: site } = await _sb_track.from('demo_sites').select('company_name, email, phone, address').eq('slug', slug).single()
    if (!site) return
    await _sb_track.from('demo_events').insert({ slug, event_type: eventType, company_name: site.company_name, email: site.email, phone: site.phone, address: site.address, created_at: new Date().toISOString() })
    await fetch('/api/notify-demo-view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, eventType, company: site.company_name, email: site.email, phone: site.phone, address: site.address }) })
  } catch (err) { console.error('[trackEvent]', err) }
}

// ═══════════════════════════════════════════════════════════════════════════
// resolveData — ghép nội dung (INDUSTRIES_DATA) + ảnh (IMAGE_BASE_ID)
// ═══════════════════════════════════════════════════════════════════════════
interface FullSiteData extends IndustryConfig {
  heroImage: string
  galleryImages: string[]
  servicesWithImages: (Service & { image: string })[]
  aboutImage: string
  galleryHeroImage: string
}

function resolveData(slug: string, supabaseOverride?: any): FullSiteData {
  const industrySlug = supabaseOverride?.industry
    ? (_IND_MAP[supabaseOverride.industry] ?? supabaseOverride.industry.replace(/_/g, '-'))
    : slug

  const content = INDUSTRIES_DATA[industrySlug] ?? INDUSTRIES_DATA['nail-salon']
  const imgs = getIndustryImages(industrySlug)

  let overrideServices: Service[] | null = null
  if (supabaseOverride?.services) {
    try {
      const parsed = typeof supabaseOverride.services === 'string'
        ? JSON.parse(supabaseOverride.services)
        : supabaseOverride.services
      if (Array.isArray(parsed) && parsed.length > 0) {
        overrideServices = parsed.map((s: any) => ({
          name: s.name || s.title || 'Service',
          desc: s.desc || s.description || '',
          price: s.price || '',
        }))
      }
    } catch {}
  }

  const merged: IndustryConfig = supabaseOverride ? {
    ...content,
    name: supabaseOverride.company_name || content.name,
    headline: supabaseOverride.hero_headline || content.headline,
    subheadline: supabaseOverride.hero_subheadline || content.subheadline,
    about: supabaseOverride.about_text || content.about,
    services: overrideServices || content.services,
    address: supabaseOverride.address || content.address,
    phone: supabaseOverride.phone || content.phone,
    email: supabaseOverride.email || content.email,
  } : content

  return {
    ...merged,
    heroImage: imgs.hero,
    galleryImages: imgs.gallery,
    servicesWithImages: merged.services.map((s, i) => ({ ...s, image: imgs.services[i % imgs.services.length] })),
    aboutImage: imgs.about,
    galleryHeroImage: imgs.galleryHero,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ALL_INDUSTRIES — danh sách cho switcher
// ═══════════════════════════════════════════════════════════════════════════
const ALL_INDUSTRIES = [
  { id: 'nail-salon', name: 'Luxe Nail Studio', cat: 'Beauty' },
  { id: 'beauty-salon', name: 'Glow Hair & Beauty', cat: 'Beauty' },
  { id: 'spa', name: 'Aetheria Wellness Spa', cat: 'Beauty' },
  { id: 'barbershop', name: 'The Vintage Razor', cat: 'Beauty' },
  { id: 'tattoo-studio', name: 'Obsidian Ink Studio', cat: 'Beauty' },
  { id: 'lash-studio', name: 'Iris Lash & Brow Studio', cat: 'Beauty' },
  { id: 'makeup-artist', name: 'Velvet Brush Makeup Studio', cat: 'Beauty' },
  { id: 'florist', name: 'Bella Bloom Florist', cat: 'Beauty' },
  { id: 'jewellery', name: 'Aurelia Fine Jewellery', cat: 'Beauty' },
  { id: 'boutique-clothing', name: 'Maison Luxe Boutique', cat: 'Beauty' },
  { id: 'clothing', name: 'Northside Streetwear Co.', cat: 'Beauty' },
  { id: 'dental', name: 'Radiant Smile Dental', cat: 'Medical' },
  { id: 'medical', name: 'Harborview Medical Clinic', cat: 'Medical' },
  { id: 'veterinary', name: 'Pawsitive Care Veterinary Hospital', cat: 'Medical' },
  { id: 'pharmacy', name: 'HealthPoint Pharmacy & Compounding', cat: 'Medical' },
  { id: 'chiropractor', name: 'Align & Restore Chiropractic', cat: 'Medical' },
  { id: 'physio', name: 'Momentum Physiotherapy', cat: 'Medical' },
  { id: 'optometrist', name: 'ClearView Optometry', cat: 'Medical' },
  { id: 'restaurant', name: 'The Hearth Kitchen', cat: 'Food' },
  { id: 'cafe', name: 'Origin Coffee Roasters', cat: 'Food' },
  { id: 'bakery', name: 'Flour & Crumb Bakehouse', cat: 'Food' },
  { id: 'food-truck', name: 'Bao & Street Kitchen', cat: 'Food' },
  { id: 'wine-bar', name: 'Somm & Cellar', cat: 'Food' },
  { id: 'sushi-restaurant', name: 'Mori Sushi & Izakaya', cat: 'Food' },
  { id: 'ice-cream-shop', name: 'Frostbite Artisan Gelato', cat: 'Food' },
  { id: 'pet-shop', name: 'Paws & Whiskers Pet Co.', cat: 'Retail' },
  { id: 'bookshop', name: 'The Cozy Nook Bookshop', cat: 'Retail' },
  { id: 'gym', name: 'Ironworks Athletic Club', cat: 'Fitness' },
  { id: 'yoga-studio', name: 'Prana Flow Yoga', cat: 'Fitness' },
  { id: 'personal-trainer', name: 'Apex Athletic Coaching', cat: 'Fitness' },
  { id: 'pilates', name: 'Form & Line Pilates Studio', cat: 'Fitness' },
  { id: 'martial-arts', name: 'Apex Martial Arts Academy', cat: 'Fitness' },
  { id: 'law-firm', name: 'Apex Legal Partners', cat: 'Legal' },
  { id: 'accounting', name: 'Vanguard Tax & Audit', cat: 'Legal' },
  { id: 'financial-advisor', name: 'Beacon Wealth Advisory', cat: 'Legal' },
  { id: 'real-estate', name: 'Maison Real Estate', cat: 'Legal' },
  { id: 'insurance', name: 'Shield Mutual Insurance Advisory', cat: 'Legal' },
  { id: 'web-agency', name: 'Futurxt Digital Solutions', cat: 'Creative' },
  { id: 'photography', name: 'Aperture Fine Art Photography', cat: 'Creative' },
  { id: 'graphic-design', name: 'Chroma Design Studio', cat: 'Creative' },
  { id: 'electrician', name: 'VoltGuard Electrical Services', cat: 'Creative' },
  { id: 'plumber', name: 'FlowRight Plumbing Co.', cat: 'Creative' },
  { id: 'landscaping', name: 'GreenScapes Design & Build', cat: 'Creative' },
  { id: 'cleaning-service', name: 'Sparkle Premium Cleaners', cat: 'Creative' },
  { id: 'interior-design', name: 'Maison Interior Studio', cat: 'Creative' },
  { id: 'video-production', name: 'Volt Cinema Productions', cat: 'Creative' },
]

// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= rating ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}>
          <path d="M10 1l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L10 14.8l-5.5 3.2 1.4-6.1L1.2 7.3l6.2-.6L10 1z"/>
        </svg>
      ))}
    </div>
  )
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border" style={{ background:'var(--accent-soft)', borderColor:'var(--border)', color:'var(--accent)' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
      {text}
    </span>
  )
}

function ContactSectionWithMap({ data }: { data: FullSiteData }) {
  return (
    <section id="contact" className="py-16 px-6 border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 content-start">
          {[
            { label: 'Address', val: data.address },
            { label: 'Contact', val: `${data.phone} · ${data.email}` },
            { label: 'Hours', val: data.hours },
          ].map((c, i) => (
            <div key={i}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>{c.label}</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.val}</p>
            </div>
          ))}
        </div>
        <GoogleMapEmbed address={data.address} />
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 1: EDITORIAL (Beauty / Retail-luxury)
// ═══════════════════════════════════════════════════════════════════════════
function EditorialLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [slot, setSlot] = useState('')
  const [booked, setBooked] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '' })

  useEffect(() => { setBooked(false); setSlot(''); setForm({ name:'', contact:'' }) }, [data.name])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!slot || !form.name) return
    setBooked(true)
    setTimeout(() => { setBooked(false); setSlot(''); setForm({ name:'', contact:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(10,8,7,0.85)', borderColor:'var(--border)' }}>
        <div className="max-w-[1400px] h-full mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold italic" style={{ borderColor:'var(--accent)', color:'var(--accent)', fontFamily:'var(--heading-font)' }}>{data.name[0]}</div>
            <span className="font-bold text-lg tracking-wide" style={{ fontFamily:'var(--heading-font)', color:'var(--text)' }}>{data.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#about" style={{ color:'var(--text-muted)' }}>Our Story</a>
            <a href="#services" style={{ color:'var(--text-muted)' }}>Services</a>
            <a href="#gallery" style={{ color:'var(--text-muted)' }}>Gallery</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
            <a href="#contact" style={{ color:'var(--text-muted)' }}>Contact</a>
          </nav>
          <button onClick={onContact}
            className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 hover:opacity-90"
            style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>
            Book Now
          </button>
        </div>
      </header>

      <section className="relative h-[100dvh] flex items-end overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, var(--bg-deep) 0%, rgba(10,8,7,0.5) 40%, rgba(10,8,7,0.15) 100%)' }}/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)' }}/>
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-10 pb-24 lg:pb-32">
          <div className="max-w-[680px] space-y-6 anim-up">
            <div className="flex items-center gap-3">
              <span className="h-px w-12" style={{ background:'var(--accent)' }}/>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color:'var(--accent)' }}>{data.tagline}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-normal leading-[1.02] tracking-tight text-white" style={{ fontFamily:'var(--heading-font)' }}>
              {data.headline}
            </h1>
            <p className="text-base text-white/75 max-w-[46ch] leading-relaxed">{data.subheadline}</p>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a href="#book" className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
                Book Your Experience
              </a>
              <div className="flex items-center gap-2">
                <StarRating rating={5} size={16}/>
                <span className="text-xs text-white/70">{data.stats[0]?.value}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
        <div className="max-w-[1000px] mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/10">
          {data.stats.map((s,i) => (
            <div key={i} className="text-center px-4">
              <div className="text-3xl lg:text-4xl font-medium text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-1.5" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden shadow-2xl" style={{ borderRadius:'var(--radius)' }}>
              <img src={data.aboutImage} alt="About" className="w-full h-full object-cover hover:scale-105 transition duration-700"/>
            </div>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 border hidden lg:block" style={{ borderColor:'var(--accent)' }}/>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Our Story</span>
            <h2 className="text-4xl lg:text-5xl font-normal leading-tight text-white" style={{ fontFamily:'var(--heading-font)' }}>Our Brand Philosophy</h2>
            <p className="text-sm leading-relaxed max-w-[58ch]" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge text="Verified & Certified"/>
              <Badge text="Fast Booking"/>
              <Badge text="Premium Quality"/>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-28 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto space-y-14">
          <div className="text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>What We Offer</span>
            <h2 className="text-4xl lg:text-5xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.servicesWithImages.map((s,i) => (
              <div key={i} className="group space-y-4">
                <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105"/>
                </div>
                <div className="space-y-2 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-medium leading-snug text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                    <span className="text-sm font-bold whitespace-nowrap pt-0.5" style={{ color:'var(--accent)' }}>{s.price}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                  <a href="#book" className="inline-flex text-[10px] font-bold uppercase tracking-widest transition pt-1 hover:opacity-80" style={{ color:'var(--accent)' }}>
                    Book this service →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Our Gallery</span>
            <h2 className="text-3xl font-normal text-white mt-2" style={{ fontFamily:'var(--heading-font)' }}>Moments & Work</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
              <img src={data.galleryHeroImage} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="g1"/>
            </div>
            {data.galleryImages.map((img,i) => (
              <div key={i} className="aspect-square overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt={`g${i+2}`}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>What Clients Say</span>
            <h2 className="text-3xl lg:text-4xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Client Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border space-y-4" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm leading-relaxed italic" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="py-28 px-6">
        <div className="max-w-[640px] mx-auto border p-8 lg:p-12" style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
          <div className="text-center space-y-3 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Book Online</span>
            <h2 className="text-3xl lg:text-4xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Choose Your Time</h2>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Pick an available slot and complete your details.</p>
          </div>
          {booked ? (
            <div className="text-center py-10 space-y-4 anim-in">
              <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto text-2xl" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>✓</div>
              <h3 className="text-xl text-white" style={{ fontFamily:'var(--heading-font)' }}>Booking Confirmed!</h3>
              <p className="text-xs max-w-[300px] mx-auto leading-relaxed" style={{ color:'var(--text-muted)' }}>
                Thank you, {form.name}. We will confirm your {slot} slot within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-7">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>1. Choose a Time Slot</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['09:00 AM','11:00 AM','02:00 PM','04:30 PM'].map(s => (
                    <button key={s} type="button" onClick={() => setSlot(s)}
                      className="py-3.5 text-xs font-mono border transition-all duration-200"
                      style={{ background: slot===s ? 'var(--accent)' : 'transparent', color: slot===s ? 'var(--accent-text)' : 'var(--text-muted)', borderColor: slot===s ? 'var(--accent)' : 'var(--border)', borderRadius:'var(--radius)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {slot && (
                <div className="space-y-4 anim-in">
                  <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>2. Your Contact Details</label>
                  <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    className="w-full h-12 border px-4 text-xs text-white focus:outline-none transition"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                  <input type="text" placeholder="Phone or Email" required value={form.contact} onChange={e => setForm({...form, contact:e.target.value})}
                    className="w-full h-12 border px-4 text-xs text-white focus:outline-none transition"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                  <button type="submit" className="w-full h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90"
                    style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                    Confirm Booking
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 2: HOSPITALITY (Food & Dining)
// ═══════════════════════════════════════════════════════════════════════════
function HospitalityLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [guests, setGuests] = useState('2')
  const [time, setTime] = useState('7:00 PM')
  const [name, setName] = useState('')
  const [reserved, setReserved] = useState(false)

  useEffect(() => { setReserved(false); setName(''); setGuests('2'); setTime('7:00 PM') }, [data.name])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setReserved(true)
    setTimeout(() => { setReserved(false); setName('') }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(7,5,4,0.88)', borderColor:'var(--border)' }}>
        <div className="max-w-[1400px] h-full mx-auto px-6 flex items-center justify-between">
          <span className="font-bold text-xl uppercase tracking-widest text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</span>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#menu" style={{ color:'var(--text-muted)' }}>Menu</a>
            <a href="#gallery" style={{ color:'var(--text-muted)' }}>Gallery</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
            <a href="#reserve" style={{ color:'var(--text-muted)' }}>Reserve</a>
          </nav>
          <a href="#reserve" className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition hover:opacity-90"
            style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
            Reserve a Table
          </a>
        </div>
      </header>

      <section className="relative h-[90dvh] flex items-end overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(7,5,4,0.95) 0%, rgba(7,5,4,0.4) 50%, rgba(7,5,4,0.1) 100%)' }}/>
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 pb-20 space-y-5 anim-up">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color:'var(--accent)' }}>{data.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-[16ch]" style={{ fontFamily:'var(--heading-font)' }}>{data.headline}</h1>
          <p className="text-sm text-white/75 max-w-[50ch] leading-relaxed">{data.subheadline}</p>
          <div className="flex items-center gap-3 pt-1">
            <StarRating rating={5} size={16}/>
            <span className="text-xs text-white/70">{data.stats[0]?.value}</span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/70">{data.stats[2]?.value}</span>
          </div>
          <div className="flex gap-4 pt-2">
            <a href="#reserve" className="px-8 py-4 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
              style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
              Reserve Now
            </a>
            <a href="#menu" className="px-8 py-4 text-xs font-bold uppercase tracking-widest border transition hover:opacity-80"
              style={{ borderColor:'rgba(255,255,255,0.3)', color:'white', borderRadius:'var(--radius)' }}>
              View Menu
            </a>
          </div>
        </div>
      </section>

      <section className="border-b" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
        <div className="max-w-[900px] mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/10 text-center">
          {data.stats.map((s,i) => (
            <div key={i} className="px-4">
              <div className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Signature Dishes</span>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Featured Menu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.servicesWithImages.map((s,i) => (
              <div key={i} className="group border overflow-hidden transition-all duration-300 hover:border-[var(--accent)]"
                style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <div className="h-52 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white leading-snug" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                    <span className="font-bold text-sm whitespace-nowrap" style={{ color:'var(--accent)' }}>{s.price}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Our Philosophy</span>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Farm to Table Mastery</h2>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3"><Badge text="Michelin Recommended"/><Badge text="100% Local Produce"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.galleryImages.slice(0,4).map((img,i) => (
              <div key={i} className="aspect-square overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={`g${i}`}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Guest Experiences</span>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border space-y-4" style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm italic leading-relaxed" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reserve" className="py-24 px-6 border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
        <div className="max-w-[500px] mx-auto border p-8 lg:p-10" style={{ background:'var(--bg-alt)', borderColor:'var(--border-strong)', borderRadius:'var(--radius)' }}>
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Reserve a Table</h2>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Book your dining experience below.</p>
          </div>
          {reserved ? (
            <div className="text-center py-8 space-y-3 anim-in">
              <div className="text-3xl">🍽️</div>
              <h3 className="font-bold text-white">Reservation Confirmed!</h3>
              <p className="text-xs leading-relaxed" style={{ color:'var(--text-muted)' }}>We have reserved a table for {guests} guests at {time}. See you soon, {name}!</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color:'var(--text-muted)' }}>Guests</label>
                  <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full h-11 border px-3 text-xs text-white focus:outline-none" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                    {['1','2','3','4','5','6','7','8+'].map(g => <option key={g} value={g}>{g} {parseInt(g)===1?'Person':'People'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color:'var(--text-muted)' }}>Time</label>
                  <select value={time} onChange={e => setTime(e.target.value)} className="w-full h-11 border px-3 text-xs text-white focus:outline-none" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                    {['5:30 PM','6:00 PM','7:00 PM','7:30 PM','8:00 PM','9:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <input type="text" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)}
                className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <input type="text" placeholder="Phone or Email" required
                className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <button type="submit" className="w-full h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                Complete Reservation
              </button>
            </form>
          )}
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 3: CLINICAL (Medical / Dental / Health)
// ═══════════════════════════════════════════════════════════════════════════
function ClinicalLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [selectedService, setSelectedService] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    setSelectedService(''); setStep(1)
    setForm({ name: '', phone: '', email: '' }); setBooked(false)
  }, [data.name])

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setBooked(true)
    setTimeout(() => { setBooked(false); setStep(1); setSelectedService(''); setForm({ name:'', phone:'', email:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(4,5,8,0.92)', borderColor:'var(--border)' }}>
        <div className="max-w-[1300px] h-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background:'var(--accent)', color:'var(--accent-text)' }}>+</div>
            <span className="font-bold text-base tracking-tight text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#services" style={{ color:'var(--text-muted)' }}>Services</a>
            <a href="#about" style={{ color:'var(--text-muted)' }}>About</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
            <a href="#book" style={{ color:'var(--text-muted)' }}>Book</a>
          </nav>
          <a href="#book" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition hover:opacity-90"
            style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
            Book Appointment
          </a>
        </div>
      </header>

      <section className="pt-20 min-h-[90dvh] grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 space-y-7">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color:'var(--accent)' }}>{data.tagline}</span>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.headline}</h1>
          <p className="text-sm leading-relaxed max-w-[50ch]" style={{ color:'var(--text-muted)' }}>{data.subheadline}</p>
          <div className="flex items-center gap-3">
            <StarRating rating={5} size={16}/>
            <span className="text-xs" style={{ color:'var(--text-muted)' }}>{data.stats[0]?.value} · {data.stats[2]?.value} patients</span>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#book" className="px-8 py-4 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
              style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
              Book Now
            </a>
            <a href="#services" className="px-8 py-4 text-xs font-bold uppercase tracking-widest border transition hover:opacity-80"
              style={{ borderColor:'var(--border-strong)', color:'var(--text)', borderRadius:'var(--radius)' }}>
              Our Services
            </a>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor:'var(--border)' }}>
            {data.stats.map((s,i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color:'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-full">
          <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{ background:'linear-gradient(to right, var(--bg) 0%, transparent 30%)' }}/>
        </div>
      </section>

      <section id="services" className="py-24 px-6 border-t" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Our Treatments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.servicesWithImages.map((s,i) => (
              <div key={i} className="border overflow-hidden group transition-all hover:border-[var(--accent)]"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <div className="h-44 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105"/>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-white leading-snug" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color:'var(--accent)' }}>{s.price}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                  <a href="#book" className="inline-block text-[10px] font-bold uppercase tracking-widest pt-2 transition hover:opacity-70" style={{ color:'var(--accent)' }}>
                    Book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
              <img src={data.galleryImages[0]} alt="clinic" className="w-full h-full object-cover"/>
            </div>
            <div className="space-y-3 pt-8">
              <div className="aspect-square overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                <img src={data.galleryImages[1]} alt="clinic" className="w-full h-full object-cover"/>
              </div>
              <div className="aspect-square overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                <img src={data.galleryImages[2] || data.galleryImages[0]} alt="clinic" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>About Our Practice</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight" style={{ fontFamily:'var(--heading-font)' }}>Compassionate Care, Advanced Technology</h2>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3">
              <Badge text="Certified Specialists"/>
              <Badge text="Same-Day Booking"/>
              <Badge text="No Wait Times"/>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Patient Feedback</span>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border space-y-4" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm italic leading-relaxed" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="py-24 px-6">
        <div className="max-w-[600px] mx-auto border p-8 lg:p-12 space-y-8" style={{ background:'var(--bg-alt)', borderColor:'var(--border-strong)', borderRadius:'var(--radius)' }}>
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Online Booking</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Book an Appointment</h2>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background:'var(--bg-deep)' }}>
            <div className="h-1 rounded-full transition-all duration-500" style={{ width:`${(step/3)*100}%`, background:'var(--accent)' }}/>
          </div>
          {booked ? (
            <div className="text-center py-8 space-y-4 anim-in">
              <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto text-xl" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>✓</div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Appointment Confirmed!</h3>
              <p className="text-xs leading-relaxed max-w-[300px] mx-auto" style={{ color:'var(--text-muted)' }}>
                Thank you, {form.name}. We'll call {form.phone} to confirm your {selectedService} appointment.
              </p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 anim-in">
              <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>Step 1 — Select a Treatment</label>
              <div className="space-y-2">
                {data.servicesWithImages.map((s,i) => (
                  <button key={i} type="button" onClick={() => { setSelectedService(s.name); setStep(2) }}
                    className="w-full flex items-center gap-4 p-4 border text-left transition hover:border-[var(--accent)]"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                    <div className="w-12 h-12 overflow-hidden flex-shrink-0" style={{ borderRadius:'var(--radius)' }}>
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{s.name}</div>
                      <div className="text-[10px] mt-0.5" style={{ color:'var(--text-muted)' }}>{s.desc}</div>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color:'var(--accent)' }}>{s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4 anim-in">
              <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>Step 2 — Choose a Time</label>
              <div className="grid grid-cols-2 gap-2">
                {['08:00 AM','10:30 AM','01:00 PM','03:30 PM'].map(t => (
                  <button key={t} type="button" onClick={() => setStep(3)}
                    className="py-4 text-xs font-mono border transition hover:border-[var(--accent)]"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)', color:'var(--text-muted)' }}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--accent)' }}>← Back</button>
            </div>
          ) : (
            <form onSubmit={submitBooking} className="space-y-4 anim-in">
              <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>Step 3 — Your Details</label>
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}
                className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="px-5 h-12 border text-xs font-bold transition"
                  style={{ borderColor:'var(--border)', color:'var(--text-muted)', borderRadius:'var(--radius)' }}>← Back</button>
                <button type="submit" className="flex-1 h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90"
                  style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                  Confirm Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 4: EXECUTIVE (Legal / Finance / Real Estate)
// ═══════════════════════════════════════════════════════════════════════════
function ExecutiveLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [activeService, setActiveService] = useState(0)
  const [form, setForm] = useState({ name:'', company:'', email:'', message:'' })
  const [sent, setSent] = useState(false)

  useEffect(() => { setActiveService(0); setSent(false); setForm({ name:'', company:'', email:'', message:'' }) }, [data.name])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name:'', company:'', email:'', message:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(5,5,6,0.92)', borderColor:'var(--border)' }}>
        <div className="max-w-[1300px] h-full mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div>
            <div className="font-bold text-base tracking-widest text-white uppercase" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</div>
            <div className="text-[9px] uppercase tracking-[0.3em] mt-0.5" style={{ color:'var(--accent)' }}>{data.tagline}</div>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#practice" style={{ color:'var(--text-muted)' }}>Practice</a>
            <a href="#services" style={{ color:'var(--text-muted)' }}>Services</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Testimonials</a>
            <a href="#consult" style={{ color:'var(--text-muted)' }}>Contact</a>
          </nav>
          <button onClick={onContact} className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition hover:opacity-90"
            style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>
            Free Consultation
          </button>
        </div>
      </header>

      <section className="relative h-[100dvh] flex items-center overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"
          style={{ filter:'grayscale(0.4) brightness(0.6)' }}/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(5,5,6,0.92) 0%, rgba(5,5,6,0.55) 50%, rgba(5,5,6,0.2) 100%)' }}/>
        <div className="relative z-10 max-w-[1300px] w-full mx-auto px-6 lg:px-10">
          <div className="max-w-[700px] space-y-7">
            <div className="flex items-center gap-4">
              <span className="h-px w-16" style={{ background:'var(--accent)' }}/>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color:'var(--accent)' }}>Est. Since 2001</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-normal leading-[1.0] text-white" style={{ fontFamily:'var(--heading-font)' }}>
              {data.headline}
            </h1>
            <p className="text-sm leading-relaxed max-w-[50ch] text-white/80">{data.subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#consult" className="px-10 py-4 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
                Schedule Consultation
              </a>
              <a href="#services" className="px-10 py-4 text-xs font-bold uppercase tracking-widest border transition hover:opacity-80"
                style={{ borderColor:'rgba(255,255,255,0.3)', color:'white' }}>
                Our Practice
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }} className="border-b">
        <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-3 divide-x divide-white/10">
          {data.stats.map((s,i) => (
            <div key={i} className="text-center px-6">
              <div className="text-3xl lg:text-5xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-2" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="practice" className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Our Firm</span>
            <h2 className="text-4xl lg:text-5xl font-normal text-white leading-tight" style={{ fontFamily:'var(--heading-font)' }}>
              Decades of Proven Excellence
            </h2>
            <p className="text-sm leading-relaxed max-w-[58ch]" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge text="Award Winning"/>
              <Badge text="Confidential"/>
              <Badge text="Global Reach"/>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden shadow-2xl">
              <img src={data.galleryImages[0]} alt="firm" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 border hidden lg:block" style={{ borderColor:'var(--accent)' }}/>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Practice Areas</span>
            <h2 className="text-3xl lg:text-4xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Expert Services</h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {data.servicesWithImages.map((s,i) => (
              <button key={i} type="button" onClick={() => setActiveService(i)}
                className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-all"
                style={{
                  background: activeService===i ? 'var(--accent)' : 'transparent',
                  color: activeService===i ? 'var(--accent-text)' : 'var(--text-muted)',
                  borderColor: activeService===i ? 'var(--accent)' : 'var(--border)',
                  borderRadius:'var(--radius)'
                }}>
                {s.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border p-8 lg:p-12"
            style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
            <div className="aspect-[4/3] overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
              <img src={data.servicesWithImages[activeService]?.image} alt={data.servicesWithImages[activeService]?.name} className="w-full h-full object-cover"/>
            </div>
            <div className="space-y-5">
              <div className="text-2xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>
                {data.servicesWithImages[activeService]?.name}
              </div>
              <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{data.servicesWithImages[activeService]?.desc}</p>
              <div className="text-lg font-bold" style={{ color:'var(--accent)', fontFamily:'var(--heading-font)' }}>
                {data.servicesWithImages[activeService]?.price}
              </div>
              <a href="#consult" className="inline-flex px-7 py-3 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                Get a Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.galleryImages.map((img,i) => (
            <div key={i} className={`overflow-hidden ${i===0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}>
              <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt={`g${i}`}/>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Client Testimonials</span>
            <h2 className="text-3xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Trusted by the Best</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-7 border space-y-5" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm leading-relaxed italic text-white/80">"{r.text}"</p>
                <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consult" className="py-28 px-6">
        <div className="max-w-[700px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Get in Touch</span>
            <h2 className="text-3xl lg:text-4xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>Request a Confidential Consultation</h2>
          </div>
          <div className="border p-8 lg:p-12" style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
            {sent ? (
              <div className="text-center py-10 space-y-4 anim-in">
                <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto text-xl" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>✓</div>
                <h3 className="text-xl text-white" style={{ fontFamily:'var(--heading-font)' }}>Message Received</h3>
                <p className="text-xs max-w-[300px] mx-auto leading-relaxed" style={{ color:'var(--text-muted)' }}>
                  Thank you, {form.name}. A partner will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                    className="h-12 border px-4 text-xs text-white focus:outline-none transition w-full"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                  <input type="text" placeholder="Company / Organisation" value={form.company} onChange={e => setForm({...form,company:e.target.value})}
                    className="h-12 border px-4 text-xs text-white focus:outline-none transition w-full"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                </div>
                <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                  className="w-full h-12 border px-4 text-xs text-white focus:outline-none transition"
                  style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                <textarea placeholder="Briefly describe your matter..." rows={4} value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  className="w-full border px-4 py-3 text-xs text-white focus:outline-none transition resize-none"
                  style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                <button type="submit" className="w-full h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90"
                  style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                  Send Consultation Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 5: ENERGY (Fitness / Gym / Sports)
// ═══════════════════════════════════════════════════════════════════════════
function EnergyLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [form, setForm] = useState({ name:'', phone:'' })
  const [sent, setSent] = useState(false)

  useEffect(() => { setSent(false); setForm({ name:'', phone:'' }) }, [data.name])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name:'', phone:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(4,4,4,0.92)', borderColor:'var(--border)' }}>
        <div className="max-w-[1300px] h-full mx-auto px-6 flex items-center justify-between">
          <span className="text-lg font-black uppercase tracking-wider text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</span>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#programs" style={{ color:'var(--text-muted)' }}>Programs</a>
            <a href="#gallery" style={{ color:'var(--text-muted)' }}>Gallery</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
            <a href="#join" style={{ color:'var(--text-muted)' }}>Join</a>
          </nav>
          <a href="#join" className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-full transition hover:opacity-90"
            style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
            Join Now
          </a>
        </div>
      </header>

      <section className="relative h-[100dvh] flex items-end overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"
          style={{ filter:'contrast(1.1) brightness(0.7)' }}/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(4,4,4,0.98) 0%, rgba(4,4,4,0.5) 40%, rgba(4,4,4,0.1) 100%)' }}/>
        <div className="absolute top-0 right-0 w-1 h-full" style={{ background:'var(--accent)' }}/>
        <div className="relative z-10 max-w-[1300px] w-full mx-auto px-6 pb-16 lg:pb-24 space-y-6">
          <span className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] rounded-full"
            style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
            {data.tagline}
          </span>
          <h1 className="text-6xl lg:text-9xl font-black uppercase leading-[0.9] text-white tracking-tight" style={{ fontFamily:'var(--heading-font)' }}>
            {data.headline}
          </h1>
          <p className="text-sm text-white/80 max-w-[48ch] leading-relaxed">{data.subheadline}</p>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a href="#join" className="px-10 py-4 text-xs font-black uppercase tracking-widest rounded-full transition hover:opacity-90"
              style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
              Start Training Today
            </a>
            <div className="flex items-center gap-2">
              <StarRating rating={5} size={16}/>
              <span className="text-xs text-white/70">{data.stats[0]?.value} Rating</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--accent)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-3 divide-x divide-black/20">
          {data.stats.map((s,i) => (
            <div key={i} className="text-center px-4">
              <div className="text-3xl lg:text-4xl font-black" style={{ fontFamily:'var(--heading-font)', color:'var(--accent-text)' }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70" style={{ color:'var(--accent-text)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className="py-24 px-6" style={{ background:'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Training Programs</span>
              <h2 className="text-4xl lg:text-5xl font-black uppercase text-white mt-1" style={{ fontFamily:'var(--heading-font)' }}>Our Programs</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.servicesWithImages.map((s,i) => (
              <div key={i} className="group relative overflow-hidden cursor-pointer" style={{ borderRadius:'var(--radius)' }}>
                <div className="aspect-[3/4]">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{ background:'linear-gradient(to top, rgba(4,4,4,0.95) 0%, rgba(4,4,4,0.3) 50%, transparent 100%)' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color:'var(--accent)' }}>{s.price}</span>
                  <h3 className="text-lg font-black uppercase text-white leading-tight" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                  <p className="text-[11px] text-white/70 mt-1 leading-relaxed">{s.desc}</p>
                  <a href="#join" className="inline-block mt-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full w-fit transition"
                    style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
                    Enrol Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t" style={{ borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Who We Are</span>
            <h2 className="text-4xl font-black uppercase text-white leading-tight" style={{ fontFamily:'var(--heading-font)' }}>Built for Serious Athletes</h2>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3">
              <Badge text="Elite Coaches"/>
              <Badge text="24/7 Access"/>
              <Badge text="Results Guaranteed"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.galleryImages.slice(0,4).map((img,i) => (
              <div key={i} className="aspect-square overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={`g${i}`}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex gap-3 overflow-x-auto pb-2">
          {[data.heroImage, ...data.galleryImages].map((img,i) => (
            <div key={i} className="flex-shrink-0 w-64 h-64 overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
              <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={`g${i}`}/>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Member Results</span>
            <h2 className="text-3xl font-black uppercase text-white mt-1" style={{ fontFamily:'var(--heading-font)' }}>Real People. Real Results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border-l-2 space-y-4" style={{ background:'var(--bg-deep)', borderColor:'var(--accent)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm italic leading-relaxed" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="py-24 px-6" style={{ background:'var(--bg-deep)' }}>
        <div className="max-w-[500px] mx-auto text-center space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Get Started</span>
            <h2 className="text-3xl font-black uppercase text-white mt-1" style={{ fontFamily:'var(--heading-font)' }}>Join the Club</h2>
            <p className="text-xs mt-2" style={{ color:'var(--text-muted)' }}>Drop your details and a coach will reach out within the hour.</p>
          </div>
          {sent ? (
            <div className="py-10 space-y-3 anim-in">
              <div className="text-3xl" style={{ color:'var(--accent)' }}>💪</div>
              <h3 className="font-black uppercase text-white" style={{ fontFamily:'var(--heading-font)' }}>Welcome Aboard!</h3>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>We'll call {form.phone || 'you'} shortly, {form.name}.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                className="w-full h-14 border px-5 text-sm text-white focus:outline-none"
                style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}
                className="w-full h-14 border px-5 text-sm text-white focus:outline-none"
                style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
              <button type="submit" className="w-full h-14 font-black text-sm uppercase tracking-widest rounded-full transition hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
                Claim Your Free Trial
              </button>
            </form>
          )}
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 6: CREATIVE (Agency / Tech / Trades / Photography)
// ═══════════════════════════════════════════════════════════════════════════
function CreativeLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [hovered, setHovered] = useState<number|null>(null)
  const [form, setForm] = useState({ name:'', email:'', brief:'' })
  const [sent, setSent] = useState(false)

  useEffect(() => { setSent(false); setForm({ name:'', email:'', brief:'' }) }, [data.name])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name:'', email:'', brief:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(0,0,0,0.9)', borderColor:'var(--border)' }}>
        <div className="max-w-[1400px] h-full mx-auto px-6 lg:px-10 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</span>
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#work" style={{ color:'var(--text-muted)' }}>Work</a>
            <a href="#services" style={{ color:'var(--text-muted)' }}>Services</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
            <a href="#start" style={{ color:'var(--text-muted)' }}>Start Project</a>
          </nav>
          <button onClick={onContact} className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition hover:bg-white hover:text-black"
            style={{ borderColor:'rgba(255,255,255,0.4)', color:'white' }}>
            Let's Talk
          </button>
        </div>
      </header>

      <section className="relative h-[100dvh] flex items-center overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"
          style={{ filter:'brightness(0.55)' }}/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)' }}/>
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-10 space-y-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color:'var(--accent)' }}>{data.tagline}</p>
          <h1 className="text-6xl lg:text-8xl font-bold leading-[0.95] text-white max-w-[16ch]" style={{ fontFamily:'var(--heading-font)' }}>
            {data.headline}
          </h1>
          <p className="text-sm text-white/75 max-w-[45ch] leading-relaxed">{data.subheadline}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#start" className="px-8 py-4 text-xs font-bold uppercase tracking-widest border-2 border-white text-white transition hover:bg-white hover:text-black">
              Start a Project
            </a>
            <a href="#work" className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:text-white">
              See Our Work ↓
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 right-10 grid grid-cols-3 gap-2 hidden lg:grid">
          {data.stats.map((s,i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="work" className="py-20 px-6 border-t" style={{ borderColor:'var(--border)' }}>
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Selected Work</h2>
            <span className="text-[10px] uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>{data.stats[2]?.value} Projects</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 aspect-square overflow-hidden">
              <img src={data.heroImage} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="work"/>
            </div>
            {data.galleryImages.map((img,i) => (
              <div key={i} className="aspect-square overflow-hidden">
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt={`w${i}`}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 border-t" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>What We Do</span>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Services</h2>
          </div>
          <div className="space-y-0 divide-y divide-white/10">
            {data.servicesWithImages.map((s,i) => (
              <div key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8 cursor-pointer transition-all duration-300"
                style={{ background: hovered===i ? 'var(--bg-deep)' : 'transparent' }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div className="md:col-span-1 text-[10px] font-mono" style={{ color:'var(--text-dim)' }}>0{i+1}</div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <span className="text-base font-bold" style={{ color:'var(--accent)', fontFamily:'var(--heading-font)' }}>{s.price}</span>
                </div>
                {hovered===i && (
                  <div className="md:col-span-12 h-48 overflow-hidden anim-in" style={{ borderRadius:'var(--radius)' }}>
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover"/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t" style={{ borderColor:'var(--border)' }}>
        <div className="max-w-[900px] mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>About</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>What Drives Us</h2>
          <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{data.about}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Badge text="Fast Delivery"/>
            <Badge text="Pixel Perfect"/>
            <Badge text="Satisfaction Guarantee"/>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Client Stories</span>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border space-y-4" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm italic leading-relaxed" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="py-28 px-6">
        <div className="max-w-[700px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Let's Build</span>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily:'var(--heading-font)' }}>Start Your Project</h2>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Tell us what you need and we'll respond within 24 hours.</p>
          </div>
          <div className="border p-8 lg:p-12" style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
            {sent ? (
              <div className="text-center py-10 space-y-4 anim-in">
                <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto text-xl" style={{ borderColor:'var(--accent)', color:'var(--accent)' }}>✓</div>
                <h3 className="text-xl text-white" style={{ fontFamily:'var(--heading-font)' }}>Brief Received</h3>
                <p className="text-xs max-w-[300px] mx-auto leading-relaxed" style={{ color:'var(--text-muted)' }}>
                  Thanks {form.name}. We'll review your brief and be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                    className="h-12 border px-4 text-xs text-white focus:outline-none w-full"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                  <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                    className="h-12 border px-4 text-xs text-white focus:outline-none w-full"
                    style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                </div>
                <textarea placeholder="Describe your project..." rows={5} value={form.brief} onChange={e => setForm({...form,brief:e.target.value})}
                  className="w-full border px-4 py-3 text-xs text-white focus:outline-none resize-none"
                  style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                <button type="submit" className="w-full h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-80 border-2 border-white text-white hover:bg-white hover:text-black"
                  style={{ borderRadius:'var(--radius)' }}>
                  Send Brief →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 7: RETAIL / BOUTIQUE (Pet Shop / Bookshop)
// ═══════════════════════════════════════════════════════════════════════════
function RetailLayout({ data, onContact }: { data: FullSiteData; onContact: () => void }) {
  const [cart, setCart] = useState<string[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [form, setForm] = useState({ name:'', email:'' })

  useEffect(() => {
    setCart([]); setCartOpen(false); setCheckoutDone(false)
    setForm({ name:'', email:'' })
  }, [data.name])

  const toggleCart = (name: string) =>
    setCart(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const checkout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setCheckoutDone(true)
    setTimeout(() => { setCheckoutDone(false); setCart([]); setCartOpen(false); setForm({ name:'', email:'' }) }, 5000)
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 backdrop-blur-xl border-b" style={{ background:'rgba(6,8,7,0.92)', borderColor:'var(--border)' }}>
        <div className="max-w-[1400px] h-full mx-auto px-6 lg:px-10 flex items-center justify-between">
          <span className="font-bold text-xl tracking-wide text-white" style={{ fontFamily:'var(--heading-font)' }}>{data.name}</span>
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>
            <a href="#collection" style={{ color:'var(--text-muted)' }}>Collection</a>
            <a href="#about" style={{ color:'var(--text-muted)' }}>Story</a>
            <a href="#gallery" style={{ color:'var(--text-muted)' }}>Gallery</a>
            <a href="#reviews" style={{ color:'var(--text-muted)' }}>Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(!cartOpen)} className="relative px-4 py-2.5 border text-[11px] font-bold uppercase tracking-widest transition"
              style={{ borderColor:'var(--border)', color:'var(--text)' }}>
              Bag
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                  style={{ background:'var(--accent)', color:'var(--accent-text)' }}>{cart.length}</span>
              )}
            </button>
            <button onClick={onContact} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition hover:opacity-90"
              style={{ background:'var(--accent)', color:'var(--accent-text)' }}>
              Enquire
            </button>
          </div>
        </div>
      </header>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}/>
          <div className="w-full max-w-[420px] h-full border-l flex flex-col anim-in" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor:'var(--border)' }}>
              <span className="font-bold text-sm text-white uppercase tracking-widest">Your Bag ({cart.length})</span>
              <button onClick={() => setCartOpen(false)} style={{ color:'var(--text-muted)' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 && (
                <p className="text-xs text-center py-10" style={{ color:'var(--text-muted)' }}>Your bag is empty.</p>
              )}
              {cart.map((name,i) => {
                const svc = data.servicesWithImages.find(s => s.name === name)
                return svc ? (
                  <div key={i} className="flex items-center gap-4 border-b pb-4" style={{ borderColor:'var(--border)' }}>
                    <div className="w-16 h-16 overflow-hidden flex-shrink-0" style={{ borderRadius:'var(--radius)' }}>
                      <img src={svc.image} alt={svc.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{svc.name}</div>
                      <div className="text-xs mt-0.5" style={{ color:'var(--accent)' }}>{svc.price}</div>
                    </div>
                    <button onClick={() => toggleCart(name)} className="text-[10px] uppercase tracking-wider" style={{ color:'var(--text-dim)' }}>Remove</button>
                  </div>
                ) : null
              })}
            </div>
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t space-y-4" style={{ borderColor:'var(--border)' }}>
                {checkoutDone ? (
                  <div className="text-center py-4 space-y-2 anim-in">
                    <div className="text-xl" style={{ color:'var(--accent)' }}>✓</div>
                    <p className="text-xs font-bold text-white">Order Received!</p>
                    <p className="text-[11px]" style={{ color:'var(--text-muted)' }}>We'll email {form.email} with details.</p>
                  </div>
                ) : (
                  <form onSubmit={checkout} className="space-y-3">
                    <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                      className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                      style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                    <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                      className="w-full h-11 border px-4 text-xs text-white focus:outline-none"
                      style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
                    <button type="submit" className="w-full h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90"
                      style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                      Place Order
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="relative h-[100dvh] flex items-end overflow-hidden">
        <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, var(--bg-deep) 0%, rgba(6,8,7,0.45) 45%, rgba(6,8,7,0.1) 100%)' }}/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 55%)' }}/>
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
          <div className="max-w-[620px] space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10" style={{ background:'var(--accent)' }}/>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color:'var(--accent)' }}>{data.tagline}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-normal leading-[1.0] text-white" style={{ fontFamily:'var(--heading-font)' }}>
              {data.headline}
            </h1>
            <p className="text-sm text-white/75 max-w-[44ch] leading-relaxed">{data.subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#collection" className="px-8 py-4 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
                style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
                Shop Collection
              </a>
              <a href="#about" className="px-8 py-4 text-xs font-bold uppercase tracking-widest border transition hover:opacity-80"
                style={{ borderColor:'rgba(255,255,255,0.35)', color:'white', borderRadius:'var(--radius)' }}>
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b" style={{ background:'var(--bg-deep)', borderColor:'var(--border)' }}>
        <div className="max-w-[900px] mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/10">
          {data.stats.map((s,i) => (
            <div key={i} className="text-center px-4">
              <div className="text-3xl font-medium text-white" style={{ fontFamily:'var(--heading-font)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-1.5" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="collection" className="py-24 px-6">
        <div className="max-w-[1300px] mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>New In</span>
              <h2 className="text-3xl font-normal text-white mt-1" style={{ fontFamily:'var(--heading-font)' }}>Current Collection</h2>
            </div>
            <span className="text-xs hidden md:block" style={{ color:'var(--text-muted)' }}>{data.servicesWithImages.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.servicesWithImages.map((s,i) => {
              const inCart = cart.includes(s.name)
              return (
                <div key={i} className="group space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden" style={{ borderRadius:'var(--radius)' }}>
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}>
                      <button onClick={() => { toggleCart(s.name); setCartOpen(true) }}
                        className="w-full py-3 text-[11px] font-bold uppercase tracking-widest transition"
                        style={{ background: inCart ? 'var(--accent-soft)' : 'var(--accent)', color: inCart ? 'var(--accent)' : 'var(--accent-text)', borderRadius:'var(--radius)' }}>
                        {inCart ? '✓ Added to Bag' : 'Add to Bag'}
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-[9px] font-bold uppercase tracking-widest"
                        style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>New</span>
                    )}
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-medium text-white leading-snug" style={{ fontFamily:'var(--heading-font)' }}>{s.name}</h3>
                      <span className="text-sm font-bold whitespace-nowrap" style={{ color:'var(--accent)' }}>{s.price}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                    <button onClick={() => { toggleCart(s.name); setCartOpen(true) }}
                      className="text-[10px] font-bold uppercase tracking-widest pt-1 transition hover:opacity-70"
                      style={{ color: inCart ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {inCart ? '✓ In Bag' : '+ Add to Bag'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] overflow-hidden shadow-2xl" style={{ borderRadius:'var(--radius)' }}>
              <img src={data.galleryImages[0]} alt="About" className="w-full h-full object-cover hover:scale-105 transition duration-700"/>
            </div>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 border hidden lg:block" style={{ borderColor:'var(--accent)' }}/>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Our Story</span>
            <h2 className="text-4xl lg:text-5xl font-normal text-white leading-tight" style={{ fontFamily:'var(--heading-font)' }}>
              Crafted with Intention
            </h2>
            <p className="text-sm leading-relaxed max-w-[55ch]" style={{ color:'var(--text-muted)' }}>{data.about}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge text="Ethically Made"/>
              <Badge text="Premium Quality"/>
              <Badge text="Free Shipping"/>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Gallery</span>
            <h2 className="text-3xl font-normal text-white mt-1" style={{ fontFamily:'var(--heading-font)' }}>As Seen & Loved</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {[data.heroImage, ...data.galleryImages, data.servicesWithImages[0]?.image, data.servicesWithImages[1]?.image].slice(0,5).map((img,i) => (
              <div key={i} className={`overflow-hidden ${i===0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
                style={{ borderRadius:'var(--radius)' }}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt={`gallery-${i}`}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-6 border-t border-b" style={{ background:'var(--bg-alt)', borderColor:'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Customer Love</span>
            <h2 className="text-3xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>What People Are Saying</h2>
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={5} size={16}/>
              <span className="text-xs" style={{ color:'var(--text-muted)' }}>{data.stats[0]?.value} · {data.stats[2]?.value} reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((r,i) => (
              <div key={i} className="p-6 border space-y-4" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}>
                <StarRating rating={r.rating}/>
                <p className="text-sm italic leading-relaxed" style={{ color:'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span className="text-[10px]" style={{ color:'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-[600px] mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color:'var(--accent)' }}>Stay Connected</span>
          <h2 className="text-3xl font-normal text-white" style={{ fontFamily:'var(--heading-font)' }}>
            Join Our Community
          </h2>
          <p className="text-xs leading-relaxed" style={{ color:'var(--text-muted)' }}>
            Be first to hear about new collections, exclusive offers, and behind-the-scenes stories.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); onContact() }} className="flex gap-2">
            <input type="email" placeholder="Your email address" required
              className="flex-1 h-12 border px-4 text-xs text-white focus:outline-none"
              style={{ background:'var(--bg-alt)', borderColor:'var(--border)', borderRadius:'var(--radius)' }}/>
            <button type="submit" className="px-6 h-12 font-bold text-xs uppercase tracking-widest transition hover:opacity-90 whitespace-nowrap"
              style={{ background:'var(--accent)', color:'var(--accent-text)', borderRadius:'var(--radius)' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <ContactSectionWithMap data={data} />

      <footer className="py-8 text-center text-[10px] border-t" style={{ background:'var(--bg-deep)', borderColor:'var(--border)', color:'var(--text-dim)' }}>
        &copy; 2026 {data.name}. Crafted by Futurxt.
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════════════════════════
export default function DemoPage() {
  const params = useParams()
  const router = useRouter()
  const slug = (params?.slug as string) || 'nail-salon'

  const [activeId, setActiveId] = useState(slug)
  const [showSwitcher, setShowSwitcher] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [supabaseOverride, setSupabaseOverride] = useState<any>(null)
  const [supabase] = useState(() => createSupabaseBrowserClient())
  const tracked = useRef(false)

  useEffect(() => {
    if (!slug || tracked.current) return
    tracked.current = true
    trackEvent(slug, 'view_demo')
  }, [slug])

  useEffect(() => { setActiveId(slug) }, [slug])

  useEffect(() => {
    async function fetchDemoSite() {
      if (INDUSTRIES_DATA[activeId]) { setSupabaseOverride(null); return }
      const { data: dbData, error } = await supabase.from('demo_sites').select('*').eq('slug', activeId).maybeSingle()
      if (dbData && !error) setSupabaseOverride(dbData)
      else setSupabaseOverride(null)
    }
    fetchDemoSite()
  }, [activeId, supabase])

const industrySlug = supabaseOverride?.industry
    ? (_IND_MAP[supabaseOverride.industry] ?? supabaseOverride.industry.replace(/_/g, '-'))
    : activeId

  const data = resolveData(activeId, supabaseOverride)
  const category = getCategory(industrySlug)
  const theme = THEMES[category]

  const styleVars = {
    '--bg': theme.bg, '--bg-alt': theme.bgAlt, '--bg-deep': theme.bgDeep,
    '--text': theme.text, '--text-muted': theme.textMuted, '--text-dim': theme.textDim,
    '--accent': theme.accent, '--accent-text': theme.accentText, '--accent-soft': theme.accentSoft,
    '--border': theme.border, '--border-strong': theme.borderStrong,
    '--heading-font': theme.headingFont, '--body-font': theme.bodyFont, '--radius': theme.radius,
  } as React.CSSProperties

  const handleSelect = (id: string) => { setActiveId(id); setShowSwitcher(false); router.push(`/demo/${id}`) }
  const handleContact = () => { trackEvent(slug, 'contact_click'); window.open(`https://futurxt.com/contact?demo=${slug}`, '_blank') }

  const cats = ['Beauty', 'Medical', 'Food', 'Retail', 'Fitness', 'Legal', 'Creative']
  const filtered = ALL_INDUSTRIES.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()) || x.id.includes(searchQuery.toLowerCase()))

  const layoutByCategory: Record<Category, React.ReactNode> = {
    beauty: <EditorialLayout data={data} onContact={handleContact} />,
    food: <HospitalityLayout data={data} onContact={handleContact} />,
    medical: <ClinicalLayout data={data} onContact={handleContact} />,
    legal: <ExecutiveLayout data={data} onContact={handleContact} />,
    fitness: <EnergyLayout data={data} onContact={handleContact} />,
    creative: <CreativeLayout data={data} onContact={handleContact} />,
    retail: <RetailLayout data={data} onContact={handleContact} />,
  }

  return (
    <div style={styleVars} className="min-h-[100dvh] bg-[var(--bg)] text-[var(--text)] font-[family:var(--body-font)] antialiased overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Fraunces:ital,wght@0,600;0,800;1,500&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,500;1,400&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"/>

      {layoutByCategory[category]}

      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setShowSwitcher(!showSwitcher)}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl transition-all duration-300 border"
          style={{ background:'var(--bg-alt)', borderColor:'var(--border-strong)', color:'var(--text)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'var(--accent)' }}/>
          View Other Demos ({ALL_INDUSTRIES.length})
        </button>

        {showSwitcher && (
          <div className="absolute bottom-16 right-0 w-[340px] max-h-[520px] overflow-y-auto rounded-2xl p-4 shadow-2xl border"
            style={{ background:'var(--bg-deep)', borderColor:'var(--border-strong)' }}>
            <div className="flex justify-between items-center border-b pb-3 mb-3" style={{ borderColor:'var(--border)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>Browse Industries</span>
              <button onClick={() => setShowSwitcher(false)} className="text-xs font-bold" style={{ color:'var(--text-muted)' }}>✕ Close</button>
            </div>
            <input type="text" placeholder="Search industries..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-lg px-3 text-xs mb-4 focus:outline-none border"
              style={{ background:'var(--bg-alt)', borderColor:'var(--border)', color:'var(--text)' }}/>
            <div className="space-y-4">
              {cats.map(cat => {
                const items = filtered.filter(x => x.cat === cat)
                if (!items.length) return null
                return (
                  <div key={cat}>
                    <span className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color:'var(--accent)' }}>{cat} ({items.length})</span>
                    {items.map(item => (
                      <button key={item.id} onClick={() => handleSelect(item.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                        style={{ background: activeId === item.id ? 'var(--accent-soft)' : 'transparent', color: activeId === item.id ? 'var(--text)' : 'var(--text-muted)', border: activeId === item.id ? '1px solid var(--accent)' : '1px solid transparent' }}>
                        {item.name}
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .anim-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-in { animation: fadeIn 0.4s ease forwards; }
      `}}/>
    </div>
  )
}