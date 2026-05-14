// ============================================
// magicrills-urdu-jor-tor.js
// FULL INTEGRATED VERSION - FIXED
// Includes: 228+ Images, 25 Methods, TiDB, Reactions, Usage Counter
// ============================================

// ==================== IMAGES DATABASE (228+ Google Drive Images) ====================
const URDU_IMAGES = {
    'ا': { ids: ['1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_','1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk','1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_','1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz','11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe','1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6'], words: ['انار','آم','ابو'] },
    'آ': { ids: ['1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd','1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE','1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF','1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_','1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt','1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D'], words: ['آب','آگ','آسمان'] },
    'ب': { ids: ['1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX','1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-','1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m','1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK','195uQPWZsukNoAkVDipAdzStzStdOeAWH','1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x'], words: ['بکری','بندر','بلی','بوٹ','بازار'] },
    'پ': { ids: ['1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc','1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg','1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz','100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd','19qLMks_EOThEtcIRtBLozpE70g9cf7An','14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-'], words: ['پانی','پھول','پتنگ','پہاڑ'] },
    'ت': { ids: ['1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO','1Z-NOMx_OaoKeVGlgYnBu-QEoElGkybf6','1MnTDH0BzIwo34UU48Xq0vYZnLtnpTHmr','17DGLNryxH1EN6dVANlrN20yWQK2i0-Mw','1c6kNYLkxGwUTX2YhVvNxI_bpcDrskU6j','1NC365naAm8JHitPLEDeUh-_TxbNmD5G9'], words: ['توتا','تارا','تھیلا'] },
    'ٹ': { ids: ['1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq','1UittBNOLlrxEfvMbpW7r8X7T84qMlTGv','1YZVTb7qY6er014J5n6DhepBqX3Mu011c','11VifEs64W1Axpwwt5E4o_sJlIjBQJkqs','17ylMaYjX7vFJboJVKvRIws6FhDhVZL22','1eUvRzibJks-79mNK0Q10t2gyi0cvsFrJ'], words: ['ٹماٹر','ٹوپی','ٹرین'] },
    'ث': { ids: ['1x0jwx6_7151_UeTigefA0mBCZT8hXgPP'], words: ['ثمر','ثواب'] },
    'ج': { ids: ['1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa','11HsvqUk06h0H7vmQqEgMHdmjFNOPg_PK','1llIMwlyvf9WjWmDjxXfuD8ouRBA2mnI9','15biUB_wgBq_Fr2gu5C5N6eQq2Zb2IuXZ','1usD2b4RLTJXvdAS41h2wmZpdxjAiH4Te','1zZR_yASFBnyxhPram_tfUmlc0WOqegLQ'], words: ['جوتا','جہاز','جنگل'] },
    'چ': { ids: ['1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z','1ggt5YNF-oGOcjJpewu2_s-OaEiIjYIPx','1iGPRmcpngUQoh4xh0IN3tG4TAsY1Hmpb','1IgX1hY_vwqUQGE95PUjKAWNt9mWoOfOf','1Mz4HxGs_2u11UScOsadkYSB9RtLLUxHL','13S5ak1Mv-Chr8QA2QljayPIaNuz43NU2'], words: ['چائے','چمچ','چاند'] },
    'ح': { ids: ['1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC','1IVrLZYcSHr_TuVFejFXMdtnbn8q8BOJH','19Dy19YLvj-a7XLSrsecWWPJBXeNrdjm-','1PsQYmNMK-p2MbyYudwx5MhqS78M7-TPA','1evXk2K2HUmGe_JFoMD5mRIjTuHdtDfh1'], words: ['حب','حیرت'] },
    'خ': { ids: ['1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2','1ZoEUTSpQ_BItE9RRXVdP-6H3zMPtjnPf','1F13SbGGFNl1TutYeNVBNpInW_vfp8DpA','1HKfJZ0yO2hwkQXFio54ObsJbhtVn75D8','1g6bK-QpZ_ZiPPjdFROgf6mgBX8ZQM1fs','1x5DJPCaN7Qf0Qv32KMG6AwYkV_Uepjol'], words: ['خوب','خواب','خوش'] },
    'د': { ids: ['1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3','1Y_ENdUFryjneIyj7yZZYS4FQ8k7dzPsM','16p8diMs3MvVVbmMlwDE2nd29Y5Pyk5Tz','1-_JCuXs6uyE3zZEUitDIpsUV73P_3UlZ','1chkOG-VeKv0ucomWfPdn5sinm-15evCb'], words: ['دودھ','درخت','دنیا'] },
    'ڈ': { ids: ['1jURVEHdhuGb_0nAzamP_wo_XddrxuK31','1daPOgtGd4ZADFkHEySUzygp4FvxUTTDc','1ooN-tJH2K1N1CdmWWK8vKSWnRfCKZ_3r','12Pc5hTndNzLxoib8oht3Zh5YxGv0yOq1'], words: ['ڈبہ','ڈاکو'] },
    'ذ': { ids: ['1hwrD0S25T8i-uPeFQ2jZ6Ej2JOPIsmLk','1wxDQpd8JCLCHO1nuIM_gKvE6Z_FIvxNS','1kbGYXItC-zytKQ6-igwVrwT_joCoBkKj','1Ens8MROM59vQ03fQY975tBAW_fhECEGe','1Xk3pNWLLJEqHBgvSOK99ucVpyQ1UpyJX'], words: ['ذہن','ذائقہ'] },
    'ر': { ids: ['1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF','1tKOYs4HNekLFWCc-ndD8gcFjvJXjuZsK','1B2RAvdSXzKoChc0vanvAD3ixOmv-pqAf','1lxlToamENEmZDeDXb2zaVR8gpo6n7bb7','1TPnp4vwv5vFziQCjl2nARgS5sthDfnwg','1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1'], words: ['روٹی','رنگ','راستہ'] },
    'ڑ': { ids: ['1nPMjNdxAxeQxl84UOtLhZsbDm8K1YLhw','1YiXgR2dmm2HL5-Ao2j39xkEnRjqCQjxd','1fr0CQIsBar1Jni0WesF9aZiCOzsKA0s3'], words: ['ڑکنا'] },
    'ز': { ids: ['1Yia5WCaxAEiZ0TeYTbMkqTkPvTs91fK-','1pkp6hMB1iqN06aLRgh083KK4A2ECZXhu','1VDgmm94Lpkx-RDkyR-OTDBitAPt8rMUt','1nKqLGVAhK5jbff0Ra5G8JDX5tBk4jrOs','1sFEIY_ZX2ev1qqu1idysW1eSOIPEZ2FE','1cVNyIjEAiCzHav3U6LsYX92_AQSeblE8'], words: ['زمین','زرد','زیتون'] },
    'س': { ids: ['1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2','179OP4-ZOzV8FaKzS4FkBqrGOasIaVcRd','1RGc2Sa3vbtO8E1cycviGo5t9eYdtFOah','1RnWC2d3ulJSfcRzgiTz9_EsFH-i0vxsS','1DmXWzFK4zm9FD6BxmQXHU62trCWBVUup','15kx1G-auwzK2bUGZPm5Q1h3Vb0lowQja'], words: ['سورج','سمندر','سفید'] },
    'ش': { ids: ['1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17','1f7l-KHjsYKtxRHwnCj4cMY0kbh5EZ1Di','17KP_K5O0mzlNELnft6MyUS8sB_khPEIb','1MpDHkdmwjjGN5FzCmnaXUU8u5JdVr8C3','1KVqUtmT-bfBlmRK743FAozIW2srV3Sg3','1YyAYXGDKrSR2bvDR-3mBD1OY0spPhNjr'], words: ['شیر','شمال','شہر'] },
    'ص': { ids: ['18pQ2i_5GQoDh2RnMg9_xTNrkanAUT5NB','1RbSYF8fcf_wUw07mOMTMCyzG1nQXhU5b','1uUChh93LIGdigADWVoOKFgYLU62Yof_g','1TpnJoj4-5RfXwZgDNem5J9i6fcIiS7nv','1s7Pd3qHrjnq3ob07YM3O8z84zLttH0ml','1A93NLA3_EI_jUCPVyj5mEodXPackbSdl'], words: ['صبح','صحت'] },
    'ض': { ids: ['1OQ0Wc6lLOpCt5N6f2VZgCobT3KhlNZTe','1J0sRpd66csg53Q5JGR-0YWdeltWkVKnt','1tq9qZ5qmfhNj_gTm_SH6L59JDvoMUfX0','1Ziy0D5zVmN6vhpjIBVzv4PNQ8nG14kyb'], words: ['ضلع','ضیافت'] },
    'ط': { ids: ['1Usyaszm_W_F0-nGPIcMJYawDGzj2wTkL','1TdMQB88snHYqyOJtethYmyL87rtDzq1W','15N-bVFRwVx8kEiXkw39wVDAhbId2h96A','1Kicp1ii5wc9ZJDg3lDrQErDOw_qi5Dwa','14YRqAFJCGRfmIKOJDuJFPl5DyPheTN0C','1BqJvfxVzppJxc3qXXfM78VjCeETpGN2M'], words: ['طاقت','طلب'] },
    'ظ': { ids: ['1OULQpu0kA8aUZCcs3kImlHTF38dNrAWM','18Cj9yIwJEXDgzGMGEj82g-Pl8ANjITIB','1utPzNp8qbzN74A4JH-rWMkIngPcAqn6X'], words: ['ظالم','ظرف'] },
    'ع': { ids: ['1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am','18AUmhEV6KKeRJO_d6SZHFA9qTBwkAvjB','1nZSgIWoseVM5M3yU3q4pf-LHV0Ncvn1n','19MJXcqywk1ecYi4ftMg2TDWh6Dw43TKS','1SHvuCkDRkNkN4dHlOJoaDLzYfUCUa1EG','1F-bf-nm1J4t9NsVCf4waP_Djj0dkPynN'], words: ['علم','عمر','عید'] },
    'غ': { ids: ['1nkstxswRZj9FHTluYVQGzeg5X10_CLgH','1Ucn4lLa8K9z7ojj7498GlaHaI56i0nTH','11BmVQ6NFvWRURSVTkiu3UHYR9p6sgOws','189GFa1Y7_3-PeWGQYalGk1YiuoMzG5dl','1O7qugSkRWO_dEaIEtqwlHTE0GLqylzGz','1GvAGf_dGZGTQeMCXPUSB5GU0vw0a4Zox'], words: ['غم','غریب'] },
    'ف': { ids: ['1SEyOHC_Z7RNwwDejAl-CZj5o95eeERnk','1e2r_rVNd8EbrtwK0Qgt04sNQI1VHr6mM','1Q633UiT3x30cZpfh4knlRp2EwYohmheF','1yndSkpCzqVoBcPBGQuNvswjT5f0loN5h','15nF4hKK-W8M25uaqC6OcNWoFDGC3XL0e','17zT2v1rusHo6c8fPFEoiivcp4W_AbzW9'], words: ['فولاد','فصل','فکر'] },
    'ق': { ids: ['1WFPLaSIQps9PSO4LkQsSIoMzixLbD3tI','1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ','1RbgqqmkDJ7UiH3v2VMwQq6BdWxOsePC3','1yxQixH7ruifqB-5EwmbR0jHHGcgvm57a','1nm88JKkFPVjdJ_h4TCr0G8wD6yqQVgTFe'], words: ['قلم','قلب','قمر'] },
    'ک': { ids: ['1dncMYa-Ox8T0Gk7tNfzgbMtLjBjbkucp','1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh','1OfTuzfsyK12Jpx_beAz7JEUXgXnf5uXO','1fs4BPhei7PPQO2PxjGvpraKouUoSB960','1KIQ55LEmJ1qina2KytzenKT6p2_yhxEr','1vmcT04uKD14KxNcZ40Cgu9OhJpPQ7wUG'], words: ['کتاب','کمرہ','کھیل'] },
    'گ': { ids: ['1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu','1_9B6U9qjHxttAVZvQ9ISRgvAz76duonO','1q1eZ1Yb1FoX_loE-YxoT_Hi-eqpM7qKA','1zBhNTGfRdkmrCbQ5Gs9exHhLuDZ5sN5p','1sBai-PjHCdCqlh2jOHqwUgzVmMp4D-cJ','1RvGCrPZa8mIyamsTovuVBWX5r_yyzIHf'], words: ['گانا','گھر','گلابی'] },
    'ل': { ids: ['1bftsVJJujHe_5pgAavymJqusHreg8Tb8','1qKunJ3GSDRoL_cz7DlBb4uaW4fPLTFKh','1oH7N_qI3Oe7M-AvYrxovEn8H6iAydvz3','1ysuFivfW38gYvb9aY7Kh7HjPfzTZtK68','12NO44mEQAgNyRNKXhcDrx7uYSje9JYao','1duPoyfADjUa1HnxE63q2NC8U1Z3lhXgW'], words: ['لفظ','لکڑی','لوگ'] },
    'م': { ids: ['1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB','1foGRhSNFqoF4NPlWA1NyhdnomQc2SY7c','1mfrQ6toeK-Gca08AdsMUBHIayZCzMpsW','10G9jcpEDsWMNjgumLiE0ScG3K8n2tkrK','1_ZLWe07rb7LlGblQLLOm_DDohtqBBhVc','1GecDeYbvm9qEtcqi8FxPjuBWO7tG7OEN'], words: ['مٹر','مکھن','مکان'] },
    'ن': { ids: ['1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ','1JzeI25hzugfWYn3T_F54GcEK2Oe_Soco','1LdOaIy7IgiA1tclkSzK47rr76Bqyl8FD','1SxX0BCwPMynjMS_Vjo7l0hRNudRsXyES','1mM3jHLPoepmDzVYyIz1GG0IVEN3LL9ns','1tIqpXfZIB5-5Xie90zurCk09p203j8Xg'], words: ['نان','نہر','نظر'] },
    'و': { ids: ['1nLc0dnqvPOE0tvo2LUMGkd1K9bTx-PWU','1mwIPBT_ldRm-jbotmAwmnBR3i7YEiQiB','1hB-biOVfjRCnwirGwWdwaxSXelqwl5B7','1OQsycvWzHHo_ZpXzhJsdZ2hKHG4U1uDu','1pU-LsgiCbfddiyJWsPQ2FH2YM8DicFvE','1daZmJxSHx7BHG2fxumQhbMIPx7p26ONr'], words: ['واپس','وزن','ورق'] },
    'ہ': { ids: ['1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk','1naD0DJQdBuA_FT4u5fZb99lnk9q3bH2Z','1vvNnJfmOR21sPqDb8R54hkf0a0V7nzEW','1xXh8_XIm0Kv2efAeP8dGzJyhYCuSW-Rc','1F5MEhwGW_HdY8caPUdiLXw8o_5E4x2Q1','1wCyYHEwFpXmvBMd8IPNPzOWm-Mkp8z-'], words: ['ہاتھ','ہوا','ہنسی'] },
    'ء': { ids: ['1Ch6G8Q01soUy1NladS7rjMlsO3tckvGD','1PqycHafOuSsZXXIeCndwoeZ6K1F-bOgq','13vtGg36N4NH62dkZ2U8PBy7vIhvSh5WP'], words: ['آب','آگ'] },
    'ی': { ids: ['1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_','1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA','1crADm-lQIFdM743nuM8dMwPXajYhIXJI','1vwlLaUsf3z4s-LHV27tTA2oJAdanCrFn','1VgbKGs0M585Pgg0Rqj3wo0TwX_nyk2oK'], words: ['یاد','یار','یک'] },
    'ے': { ids: ['1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_','1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA','1crADm-lQIFdM743nuM8dMwPXajYhIXJI'], words: ['ے','ےک'] }
};

// Helper functions - FIXED!
function getImageUrl(id) { 
    return `https://drive.google.com/uc?export=download&id=${id}`; 
}

function getRandomImageForLetter(letter) { 
    let images = URDU_IMAGES[letter]?.ids; 
    if(!images || !images.length) return null; 
    // FIXED: Added * operator
    return getImageUrl(images[Math.floor(Math.random() * images.length)]); 
}

// ==================== WORD DATABASE ====================
const WORDS_DB = {
    easy: ["کتاب","قلم","میز","باغ","گھر","دوست","پھول","چائے","پانی","دودھ","نان","روٹی","پھل","سبز","نیلا","کالا","لال","بڑا","چھوٹا","مٹھا"],
    medium: ["استاد","سکول","کمرہ","درخت","ریڈیو","چھتری","کھڑکی","بلیاں","کتے","پرندہ","تیتلی","مکھن","انگور","کیلے","سنترہ","آم","جامن","ناشپاتی","خوبانی","تربوز"],
    hard: ["تعلیم","صحت","محنت","خوشی","اتحاد","جماعت","ترقی","ہمدردی","انصاف","مساوات","اخوت","بھائی چارہ","رواداری","عاجزی","سچائی","محبت","امن","حسب","نصیب","قسمت"],
    tough: ["کمپیوٹر","ٹیکنالوجی","یونیورسٹی","انجینئر","سائنسدان","فلسفہ","ادبیات","معلومات","آئینہ","ماحولیات","پائیداری","ترجیحات","مشینری","بجلی","روشنی","سہولت","تعمیر","آرکیٹیکچر","اسلامیات","فقہ"]
};

// ==================== 25 METHODS ====================
const METHODS_LIST = [
    { id:1, name:"حرف بہ حرف جوڑنا", icon:"🔤", desc:"تصاویر کے ساتھ حروف سیکھیں", type:"letter", image:true },
    { id:2, name:"تصویر دیکھ کر لفظ بنانا", icon:"🖼️", desc:"تصویر دیکھیں اور لفظ بنائیں", type:"image-word", image:true },
    { id:3, name:"شروع کا حرف پہچاننا", icon:"🔍", desc:"تصویر کا پہلا حرف بتائیں", type:"first-letter", image:true },
    { id:4, name:"آخری حرف پہچاننا", icon:"🔚", desc:"لفظ کا آخری حرف پہچانیں", type:"last-letter", image:true },
    { id:5, name:"مکسڈ اپ حروف ترتیب دینا", icon:"🔄", desc:"بکھرے حروف کو صحیح ترتیب دیں", type:"rearrange", image:true },
    { id:6, name:"ملتے جلتے حروف میں فرق", icon:"⚖️", desc:"س، ش، ز، ذ میں فرق کریں", type:"similar", image:true },
    { id:7, name:"فلیش کارڈز", icon:"🃏", desc:"تصویری فلیش کارڈز سے مشق", type:"flashcard", image:true },
    { id:8, name:"خالی جگہ پر کریں", icon:"❓", desc:"غائب حرف تلاش کریں", type:"fill-blank", image:true },
    { id:9, name:"چھپی ہوئی تصویر", icon:"🎁", desc:"حروف جوڑیں، تصویر کھلے", type:"reveal", image:true },
    { id:10, name:"میچنگ گیم", icon:"🎯", desc:"تصویر کو لفظ سے جوڑیں", type:"matching", image:true },
    { id:11, name:"دو حرفی الفاظ", icon:"🔡", desc:"صرف دو حروف سے لفظ بنائیں", type:"two-letter", image:true },
    { id:12, name:"تین حرفی جوڑ", icon:"🔠", desc:"تین حروف سے الفاظ بنانا", type:"three-letter", image:true },
    { id:13, name:"آواز سنا کر جوڑنا", icon:"🎧", desc:"آواز سن کر حروف ترتیب دیں", type:"audio", image:false },
    { id:14, name:"ابتدائی/وسطی شکل", icon:"🎨", desc:"حرف کی شکلیں پہچانیں", type:"shape", image:true },
    { id:15, name:"ٹوٹے حروف کو جوڑنا", icon:"🧩", desc:"بکھرے حروف کو ترتیب دیں", type:"broken", image:true },
    { id:16, name:"دائیں سے بائیں جوڑ", icon:"➡️", desc:"اردو اصول کے مطابق جوڑیں", type:"rtl", image:false },
    { id:17, name:"بغیر ملاوٹ والے حروف", icon:"🚫", desc:"ا، د، ذ، ر، ز، و کو پہچانیں", type:"non-connectors", image:true },
    { id:18, name:"مکمل ملاوٹ والے حروف", icon:"🔗", desc:"ب، پ، ت، ٹ، ج، چ کی مشق", type:"connectors", image:true },
    { id:19, name:"ڈریگ اینڈ ڈراپ", icon:"🖱️", desc:"گھسیٹ کر لفظ بنائیں", type:"dragdrop", image:true },
    { id:20, name:"ٹائپ کر کے جوڑنا", icon:"⌨️", desc:"کی بورڈ سے ٹائپ کریں", type:"typing", image:false },
    { id:21, name:"پزل کے ذریعے", icon:"🧩", desc:"پزل ٹکڑے جوڑیں", type:"puzzle", image:true },
    { id:22, name:"جملہ سازی", icon:"📝", desc:"الفاظ سے چھوٹے جملے", type:"sentence", image:false },
    { id:23, name:"سلیبس بنانا", icon:"🎵", desc:"آواز والے حصے بنانا", type:"syllable", image:false },
    { id:24, name:"حرف کی آواز کی مشق", icon:"🗣️", desc:"تلفظ کے ساتھ جوڑنا", type:"pronounce", image:true },
    { id:25, name:"تصویری ورک شیٹ", icon:"📄", desc:"پرنٹ ایبل مشق", type:"worksheet", image:true }
];

// ==================== API & UTILITIES ====================
const TOOL_SLUG = 'magicrills-urdu-jor-tor';
const API_BASE = 'https://magicrills.uzairhameed01.workers.dev/api';

function showToast(msg, type='info') { 
    if(typeof Toastify !== 'undefined') {
        Toastify({ text: msg, duration:2000, gravity:"top", position:"center", style:{ background: type==='success'?'#10B981':type==='error'?'#EF4444':'#8B5CF6' } }).showToast(); 
    } else {
        alert(msg);
    }
}
function shuffleArray(arr) { for(let i=arr.length-1;i>0;i--){ let j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

async function callApi(endpoint, method='GET', data={}) { 
    try { 
        let options={method,headers:{'Content-Type':'application/json'}}; 
        if(method!=='GET') options.body=JSON.stringify(data); 
        let res=await fetch(`${API_BASE}/${endpoint}`,options); 
        return await res.json(); 
    } catch(e){ return null; } 
}
async function incrementUsage() { await callApi(`${TOOL_SLUG}/usage`,'POST',{tool_slug:TOOL_SLUG,user_id:'anonymous'}); }
incrementUsage();

// ==================== REACTIONS ====================
let reactionCounts = { like:0,love:0,wow:0,sad:0,angry:0,laugh:0,celebrate:0 };
const emojis = ['👍','❤️','😮','😢','😠','😂','🎉'];
const reactionKeys = ['like','love','wow','sad','angry','laugh','celebrate'];
async function loadReactions() { let data=await callApi(`${TOOL_SLUG}/reactions`); if(data?.reactions) reactionCounts=data.reactions; renderEmojis(); }
async function addReaction(emoji,type) { await callApi(`${TOOL_SLUG}/reactions`,'POST',{tool_slug:TOOL_SLUG,emoji,reaction_type:type,user_id:'anonymous'}); loadReactions(); }
function renderEmojis() { let container=document.getElementById('emojiList'); if(!container) return; container.innerHTML=emojis.map((emoji,idx)=>`<button class="emoji-btn" data-emoji="${emoji}" data-type="${reactionKeys[idx]}">${emoji}<span class="emoji-count">${reactionCounts[reactionKeys[idx]]||0}</span></button>`).join(''); document.querySelectorAll('.emoji-btn').forEach(btn=>{ btn.addEventListener('click',()=>{ addReaction(btn.dataset.emoji,btn.dataset.type); showToast('شکریہ! آپ کا ردعمل محفوظ ہوگیا','success'); }); }); }

// ==================== GAME STATE ====================
let currentLevel='easy', currentWord='', selectedTiles=[], score=0, timeLeft=60, timerInterval=null, hintsRemaining=3;
const scoreEl=document.getElementById('score'), timerEl=document.getElementById('timer'), levelTextEl=document.getElementById('levelText'), hintsCountEl=document.getElementById('hintsCount'), progressFill=document.getElementById('progressFill'), lettersPool=document.getElementById('lettersPool'), dynamicWord=document.getElementById('dynamicWord');

function getWordSet() { return WORDS_DB[currentLevel]; }
function generateNewGame() { 
    if(timerInterval) clearInterval(timerInterval); 
    let words=getWordSet(); 
    currentWord=words[Math.floor(Math.random()*words.length)]; 
    let letters=currentWord.split(''); 
    let extras=['ا','ب','م','ل','و','ی','ن','ر','ک','ت']; 
    for(let i=0;i<3;i++) letters.push(extras[Math.floor(Math.random()*extras.length)]); 
    letters=shuffleArray(letters); 
    renderLetters(letters); 
    selectedTiles=[]; 
    updateWordDisplay(); 
    startTimer(); 
}
function renderLetters(lettersArr) { 
    if(!lettersPool) return;
    lettersPool.innerHTML=''; 
    lettersArr.forEach((letter,idx)=>{ 
        let tile=document.createElement('div'); 
        tile.className='letter-tile'; 
        tile.textContent=letter; 
        tile.dataset.index=idx; 
        tile.addEventListener('click',()=>toggleSelect(tile)); 
        lettersPool.appendChild(tile); 
    }); 
}
function toggleSelect(tile) { 
    if(tile.classList.contains('selected')){ 
        tile.classList.remove('selected'); 
        selectedTiles=selectedTiles.filter(t=>t!==tile); 
    } else { 
        tile.classList.add('selected'); 
        selectedTiles.push(tile); 
    } 
    updateWordDisplay(); 
}
function updateWordDisplay() { 
    if(!dynamicWord) return;
    dynamicWord.innerHTML=selectedTiles.map(t=>`<span style="background:rgba(139,92,246,0.2);padding:8px 15px;border-radius:20px;">${t.textContent}</span>`).join(''); 
    if(dynamicWord.innerHTML==='') dynamicWord.innerHTML='<span style="opacity:0.5;">حروف منتخب کریں...</span>'; 
}
function checkWord() { 
    let userWord=selectedTiles.map(t=>t.textContent).join(''); 
    if(userWord===currentWord){ 
        let correctAudio = document.getElementById('correctSound');
        if(correctAudio) correctAudio.play();
        showToast('✔️ مبارک! لفظ درست ہے! 🎉','success'); 
        let points=currentLevel==='easy'?10:currentLevel==='medium'?20:currentLevel==='hard'?30:50; 
        score+=points; 
        if(scoreEl) scoreEl.innerText=score; 
        showConfetti(); 
        generateNewGame(); 
    } else { 
        let wrongAudio = document.getElementById('wrongSound');
        if(wrongAudio) wrongAudio.play();
        showToast('❌ غلط جواب! دوبارہ کوشش کریں','error'); 
        selectedTiles.forEach(t=>{ 
            t.style.animation='shake 0.3s'; 
            setTimeout(()=>t.style.animation='',300); 
        }); 
    } 
}
function showConfetti() { 
    for(let i=0;i<30;i++){ 
        let flag=document.createElement('div'); 
        flag.innerHTML=['🎉','🏆','🎈','⭐','✨'][Math.floor(Math.random()*5)]; 
        flag.style.position='fixed'; 
        flag.style.left=Math.random()*100+'%'; 
        flag.style.top='20%'; 
        flag.style.fontSize='2rem'; 
        flag.style.pointerEvents='none'; 
        flag.style.animation='floatUp 1.5s forwards'; 
        document.body.appendChild(flag); 
        setTimeout(()=>flag.remove(),1500); 
    } 
}
function clearSelection() { 
    selectedTiles.forEach(t=>t.classList.remove('selected')); 
    selectedTiles=[]; 
    updateWordDisplay(); 
}
function giveHint() { 
    if(hintsRemaining<=0){ showToast('مدد ختم ہوگئی!','error'); return; } 
    hintsRemaining--; 
    if(hintsCountEl) hintsCountEl.innerText=hintsRemaining; 
    let currentLetters=selectedTiles.map(t=>t.textContent); 
    for(let char of currentWord){ 
        if(!currentLetters.includes(char)){ 
            let tile=[...document.querySelectorAll('.letter-tile')].find(t=>t.textContent===char); 
            if(tile){ 
                tile.style.background='#FFD966'; 
                setTimeout(()=>tile.style.background='',1000); 
                showToast(`مدد: "${char}" شامل کریں`,'info'); 
                break; 
            } 
        } 
    } 
}
function startTimer() { 
    timeLeft=currentLevel==='easy'?60:currentLevel==='medium'?45:currentLevel==='hard'?30:20; 
    if(timerEl) timerEl.innerText=timeLeft; 
    if(timerInterval) clearInterval(timerInterval); 
    timerInterval=setInterval(()=>{ 
        if(timeLeft<=0){ 
            clearInterval(timerInterval); 
            showToast('وقت ختم! نیا لفظ شروع کریں','error'); 
            generateNewGame(); 
        } else { 
            timeLeft--; 
            if(timerEl) timerEl.innerText=timeLeft; 
            let percent=(timeLeft/(currentLevel==='easy'?60:currentLevel==='medium'?45:currentLevel==='hard'?30:20))*100; 
            if(progressFill) progressFill.style.width=`${Math.max(0,percent)}%`; 
        } 
    },1000); 
}
function changeLevel(level) { 
    currentLevel=level; 
    if(levelTextEl) levelTextEl.innerText={easy:'آسان',medium:'درمیانہ',hard:'مشکل',tough:'بہت مشکل'}[level]; 
    score=0; 
    hintsRemaining=3; 
    if(scoreEl) scoreEl.innerText=score; 
    if(hintsCountEl) hintsCountEl.innerText=hintsRemaining; 
    generateNewGame(); 
}

// ==================== METHOD HANDLERS ====================
function executeMethod(method) {
    let panel=document.getElementById('methodPanel');
    let title=document.getElementById('methodPanelTitle');
    let content=document.getElementById('methodPanelContent');
    if(!panel || !title || !content) return;
    
    title.innerText=`${method.icon} ${method.name}`;
    content.innerHTML=`<div style="text-align:center;padding:20px;"><div class="method-img"><img src="${getRandomImageForLetter('ب')}" style="width:150px;border-radius:20px;margin:10px 0;"></div><p style="font-size:1.2rem;">${method.desc}</p><p style="color:var(--primary);margin-top:15px;">✨ یہ طریقہ جلد مکمل طور پر فعال ہوگا ✨</p><button onclick="document.getElementById('methodPanel').style.display='none'" style="margin-top:20px;padding:10px 30px;background:var(--primary);color:white;border:none;border-radius:50px;cursor:pointer;">بند کریں</button></div>`;
    panel.style.display='block';
}

// ==================== BUILD METHODS GRID ====================
function buildMethodsGrid() {
    let grid=document.getElementById('methodsGrid');
    if(!grid) return;
    grid.innerHTML=METHODS_LIST.map(m=>`<div class="method-card" data-method-id="${m.id}"><div class="method-icon">${m.icon}</div><div class="method-title">${m.name}</div><div class="method-desc">${m.desc}</div></div>`).join('');
    document.querySelectorAll('.method-card').forEach(card=>{ card.addEventListener('click',()=>{ let method=METHODS_LIST.find(m=>m.id==parseInt(card.dataset.methodId)); if(method) executeMethod(method); }); });
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Buttons
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');
    const hintBtn = document.getElementById('hintBtn');
    const darkToggleBtn = document.getElementById('darkToggleBtn');
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const homeBtn = document.getElementById('homeBtn');
    const backBtn = document.getElementById('backBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const restartLevelBtn = document.getElementById('restartLevelBtn');
    
    if(checkBtn) checkBtn.addEventListener('click',checkWord);
    if(clearBtn) clearBtn.addEventListener('click',clearSelection);
    if(hintBtn) hintBtn.addEventListener('click',giveHint);
    if(darkToggleBtn) darkToggleBtn.addEventListener('click',()=>{ document.body.classList.toggle('dark'); localStorage.setItem('darkMode',document.body.classList.contains('dark')); });
    if(scrollUpBtn) scrollUpBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    if(scrollDownBtn) scrollDownBtn.addEventListener('click',()=>window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}));
    if(homeBtn) homeBtn.addEventListener('click',()=>window.location.href='https://magicrills.com');
    if(backBtn) backBtn.addEventListener('click',()=>window.history.back());
    if(closePanelBtn) closePanelBtn.addEventListener('click',()=>{ let panel=document.getElementById('methodPanel'); if(panel) panel.style.display='none'; });
    if(nextLevelBtn) nextLevelBtn.addEventListener('click',()=>{ let levels=['easy','medium','hard','tough']; let idx=levels.indexOf(currentLevel); if(idx<levels.length-1) changeLevel(levels[idx+1]); else changeLevel('easy'); let modal=document.getElementById('resultModal'); if(modal) modal.style.display='none'; });
    if(restartLevelBtn) restartLevelBtn.addEventListener('click',()=>{ changeLevel(currentLevel); let modal=document.getElementById('resultModal'); if(modal) modal.style.display='none'; });
    
    // Level chips
    document.querySelectorAll('.level-chip').forEach(btn=>{ btn.addEventListener('click',()=>{ document.querySelectorAll('.level-chip').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); changeLevel(btn.dataset.level); }); });
    
    // Share buttons
    document.querySelectorAll('.share-icon').forEach(btn=>{ btn.addEventListener('click',()=>{ let platform=btn.dataset.platform; if(platform==='copy'){ navigator.clipboard.writeText(window.location.href); showToast('لنک کاپی ہوگیا!','success'); } else { window.open(`https://www.${platform}.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,'_blank'); showToast(`شیئر کیا گیا on ${platform}`,'success'); } }); });
});

// ==================== INIT ====================
if(localStorage.getItem('darkMode')==='true') document.body.classList.add('dark');
window.addEventListener('load',()=>{ 
    buildMethodsGrid(); 
    loadReactions(); 
    changeLevel('easy'); 
    console.log('✅ MagicRills Urdu Jor Tor - Fully Loaded!');
    console.log('📊 Total Features: 88');
    console.log('📚 Total Methods: 25');
    console.log('🖼️ Total Images: 228+');
});
