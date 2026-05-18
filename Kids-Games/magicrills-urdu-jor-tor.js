// ============================================
// MAGICRILLS URDU JOR TOR - MAIN JAVASCRIPT
// Version: 4.0 | 20 Teaching Methods
// Game does NOT auto-start | Section-wise code
// ============================================

// ========================================== */
// SECTION 1: IMAGES DATABASE (228+ IMAGES)   
// ========================================== */

const URDU_IMAGES = {
    'ا': { ids: ['1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_','1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk','1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_','1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz','11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe','1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6'] },
    'آ': { ids: ['1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd','1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE','1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF','1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_','1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt','1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D'] },
    'ب': { ids: ['1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX','1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-','1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m','1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK','195uQPWZsukNoAkVDipAdzStzStdOeAWH','1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x'] },
    'پ': { ids: ['1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc','1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg','1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz','100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd','19qLMks_EOThEtcIRtBLozpE70g9cf7An','14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-'] },
    'ت': { ids: ['1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO','1Z-NOMx_OaoKeVGlgYnBu-QEoElGkybf6','1MnTDH0BzIwo34UU48Xq0vYZnLtnpTHmr','17DGLNryxH1EN6dVANlrN20yWQK2i0-Mw','1c6kNYLkxGwUTX2YhVvNxI_bpcDrskU6j','1NC365naAm8JHitPLEDeUh-_TxbNmD5G9'] },
    'ٹ': { ids: ['1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq','1UittBNOLlrxEfvMbpW7r8X7T84qMlTGv','1YZVTb7qY6er014J5n6DhepBqX3Mu011c','11VifEs64W1Axpwwt5E4o_sJlIjBQJkqs','17ylMaYjX7vFJboJVKvRIws6FhDhVZL22','1eUvRzibJks-79mNK0Q10t2gyi0cvsFrJ'] },
    'ث': { ids: ['1x0jwx6_7151_UeTigefA0mBCZT8hXgPP','1x0jwx6_7151_UeTigefA0mBCZT8hXgPP','1x0jwx6_7151_UeTigefA0mBCZT8hXgPP'] },
    'ج': { ids: ['1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa','11HsvqUk06h0H7vmQqEgMHdmjFNOPg_PK','1llIMwlyvf9WjWmDjxXfuD8ouRBA2mnI9','15biUB_wgBq_Fr2gu5C5N6eQq2Zb2IuXZ','1usD2b4RLTJXvdAS41h2wmZpdxjAiH4Te','1zZR_yASFBnyxhPram_tfUmlc0WOqegLQ'] },
    'چ': { ids: ['1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z','1ggt5YNF-oGOcjJpewu2_s-OaEiIjYIPx','1iGPRmcpngUQoh4xh0IN3tG4TAsY1Hmpb','1IgX1hY_vwqUQGE95PUjKAWNt9mWoOfOf','1Mz4HxGs_2u11UScOsadkYSB9RtLLUxHL','13S5ak1Mv-Chr8QA2QljayPIaNuz43NU2'] },
    'ح': { ids: ['1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC','1IVrLZYcSHr_TuVFejFXMdtnbn8q8BOJH','19Dy19YLvj-a7XLSrsecWWPJBXeNrdjm-','1PsQYmNMK-p2MbyYudwx5MhqS78M7-TPA','1evXk2K2HUmGe_JFoMD5mRIjTuHdtDfh1'] },
    'خ': { ids: ['1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2','1ZoEUTSpQ_BItE9RRXVdP-6H3zMPtjnPf','1F13SbGGFNl1TutYeNVBNpInW_vfp8DpA','1HKfJZ0yO2hwkQXFio54ObsJbhtVn75D8','1g6bK-QpZ_ZiPPjdFROgf6mgBX8ZQM1fs','1x5DJPCaN7Qf0Qv32KMG6AwYkV_Uepjol'] },
    'د': { ids: ['1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3','1Y_ENdUFryjneIyj7yZZYS4FQ8k7dzPsM','16p8diMs3MvVVbmMlwDE2nd29Y5Pyk5Tz','1-_JCuXs6uyE3zZEUitDIpsUV73P_3UlZ','1chkOG-VeKv0ucomWfPdn5sinm-15evCb'] },
    'ڈ': { ids: ['1jURVEHdhuGb_0nAzamP_wo_XddrxuK31','1rmKPz98TSQPxMbwTXBL8qZQ0dqPoKNKU','1daPOgtGd4ZADFkHEySUzygp4FvxUTTDc','1ooN-tJH2K1N1CdmWWK8vKSWnRfCKZ_3r','12Pc5hTndNzLxoib8oht3Zh5YxGv0yOq1'] },
    'ذ': { ids: ['1hwrD0S25T8i-uPeFQ2jZ6Ej2JOPIsmLk','1wxDQpd8JCLCHO1nuIM_gKvE6Z_FIvxNS','1kbGYXItC-zytKQ6-igwVrwT_joCoBkKj','1Ens8MROM59vQ03fQY975tBAW_fhECEGe','1Xk3pNWLLJEqHBgvSOK99ucVpyQ1UpyJX'] },
    'ر': { ids: ['1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF','1tKOYs4HNekLFWCc-ndD8gcFjvJXjuZsK','1B2RAvdSXzKoChc0vanvAD3ixOmv-pqAf','1lxlToamENEmZDeDXb2zaVR8gpo6n7bb7','1TPnp4vwv5vFziQCjl2nARgS5sthDfnwg','1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1'] },
    'ڑ': { ids: ['1nPMjNdxAxeQxl84UOtLhZsbDm8K1YLhw','1YiXgR2dmm2HL5-Ao2j39xkEnRjqCQjxd','1fr0CQIsBar1Jni0WesF9aZiCOzsKA0s3'] },
    'ز': { ids: ['1Yia5WCaxAEiZ0TeYTbMkqTkPvTs91fK-','1pkp6hMB1iqN06aLRgh083KK4A2ECZXhu','1VDgmm94Lpkx-RDkyR-OTDBitAPt8rMUt','1nKqLGVAhK5jbff0Ra5G8JDX5tBk4jrOs','1sFEIY_ZX2ev1qqu1idysW1eSOIPEZ2FE','1cVNyIjEAiCzHav3U6LsYX92_AQSeblE8'] },
    'س': { ids: ['1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2','179OP4-ZOzV8FaKzS4FkBqrGOasIaVcRd','1RGc2Sa3vbtO8E1cycviGo5t9eYdtFOah','1RnWC2d3ulJSfcRzgiTz9_EsFH-i0vxsS','1DmXWzFK4zm9FD6BxmQXHU62trCWBVUup','15kx1G-auwzK2bUGZPm5Q1h3Vb0lowQja'] },
    'ش': { ids: ['1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17','1f7l-KHjsYKtxRHwnCj4cMY0kbh5EZ1Di','17KP_K5O0mzlNELnft6MyUS8sB_khPEIb','1MpDHkdmwjjGN5FzCmnaXUU8u5JdVr8C3','1KVqUtmT-bfBlmRK743FAozIW2srV3Sg3','1YyAYXGDKrSR2bvDR-3mBD1OY0spPhNjr'] },
    'ص': { ids: ['18pQ2i_5GQoDh2RnMg9_xTNrkanAUT5NB','1RbSYF8fcf_wUw07mOMTMCyzG1nQXhU5b','1uUChh93LIGdigADWVoOKFgYLU62Yof_g','1TpnJoj4-5RfXwZgDNem5J9i6fcIiS7nv','1s7Pd3qHrjnq3ob07YM3O8z84zLttH0ml','1A93NLA3_EI_jUCPVyj5mEodXPackbSdl'] },
    'ض': { ids: ['1OQ0Wc6lLOpCt5N6f2VZgCobT3KhlNZTe','1J0sRpd66csg53Q5JGR-0YWdeltWkVKnt','1tq9qZ5qmfhNj_gTm_SH6L59JDvoMUfX0','1Ziy0D5zVmN6vhpjIBVzv4PNQ8nG14kyb'] },
    'ط': { ids: ['1Usyaszm_W_F0-nGPIcMJYawDGzj2wTkL','1TdMQB88snHYqyOJtethYmyL87rtDzq1W','15N-bVFRwVx8kEiXkw39wVDAhbId2h96A','1Kicp1ii5wc9ZJDg3lDrQErDOw_qi5Dwa','14YRqAFJCGRfmIKOJDuJFPl5DyPheTN0C','1BqJvfxVzppJxc3qXXfM78VjCeETpGN2M'] },
    'ظ': { ids: ['1OULQpu0kA8aUZCcs3kImlHTF38dNrAWM','18Cj9yIwJEXDgzGMGEj82g-Pl8ANjITIB','1utPzNp8qbzN74A4JH-rWMkIngPcAqn6X'] },
    'ع': { ids: ['1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am','18AUmhEV6KKeRJO_d6SZHFA9qTBwkAvjB','1nZSgIWoseVM5M3yU3q4pf-LHV0Ncvn1n','19MJXcqywk1ecYi4ftMg2TDWh6Dw43TKS','1SHvuCkDRkNkN4dHlOJoaDLzYfUCUa1EG','1F-bf-nm1J4t9NsVCf4waP_Djj0dkPynN'] },
    'غ': { ids: ['1nkstxswRZj9FHTluYVQGzeg5X10_CLgH','1Ucn4lLa8K9z7ojj7498GlaHaI56i0nTH','11BmVQ6NFvWRURSVTkiu3UHYR9p6sgOws','189GFa1Y7_3-PeWGQYalGk1YiuoMzG5dl','1O7qugSkRWO_dEaIEtqwlHTE0GLqylzGz','1GvAGf_dGZGTQeMCXPUSB5GU0vw0a4Zox'] },
    'ف': { ids: ['1SEyOHC_Z7RNwwDejAl-CZj5o95eeERnk','1e2r_rVNd8EbrtwK0Qgt04sNQI1VHr6mM','1Q633UiT3x30cZpfh4knlRp2EwYohmheF','1yndSkpCzqVoBcPBGQuNvswjT5f0loN5h','15nF4hKK-W8M25uaqC6OcNWoFDGC3XL0e','17zT2v1rusHo6c8fPFEoiivcp4W_AbzW9'] },
    'ق': { ids: ['1WFPLaSIQps9PSO4LkQsSIoMzixLbD3tI','1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ','1RbgqqmkDJ7UiH3v2VMwQq6BdWxOsePC3','1yxQixH7ruifqB-5EwmbR0jHHGcgvm57a','1nm88JKkFPVjdJ_h4TCr0G8wD6yqQVgTFe'] },
    'ک': { ids: ['1dncMYa-Ox8T0Gk7tNfzgbMtLjBjbkucp','1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh','1OfTuzfsyK12Jpx_beAz7JEUXgXnf5uXO','1fs4BPhei7PPQO2PxjGvpraKouUoSB960','1KIQ55LEmJ1qina2KytzenKT6p2_yhxEr','1vmcT04uKD14KxNcZ40Cgu9OhJpPQ7wUG'] },
    'گ': { ids: ['1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu','1_9B6U9qjHxttAVZvQ9ISRgvAz76duonO','1q1eZ1Yb1FoX_loE-YxoT_Hi-eqpM7qKA','1zBhNTGfRdkmrCbQ5Gs9exHhLuDZ5sN5p','1sBai-PjHCdCqlh2jOHqwUgzVmMp4D-cJ','1RvGCrPZa8mIyamsTovuVBWX5r_yyzIHf'] },
    'ل': { ids: ['1bftsVJJujHe_5pgAavymJqusHreg8Tb8','1qKunJ3GSDRoL_cz7DlBb4uaW4fPLTFKh','1oH7N_qI3Oe7M-AvYrxovEn8H6iAydvz3','1ysuFivfW38gYvb9aY7Kh7HjPfzTZtK68','12NO44mEQAgNyRNKXhcDrx7uYSje9JYao','1duPoyfADjUa1HnxE63q2NC8U1Z3lhXgW'] },
    'م': { ids: ['1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB','1foGRhSNFqoF4NPlWA1NyhdnomQc2SY7c','1mfrQ6toeK-Gca08AdsMUBHIayZCzMpsW','10G9jcpEDsWMNjgumLiE0ScG3K8n2tkrK','1_ZLWe07rb7LlGblQLLOm_DDohtqBBhVc','1GecDeYbvm9qEtcqi8FxPjuBWO7tG7OEN'] },
    'ن': { ids: ['1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ','1JzeI25hzugfWYn3T_F54GcEK2Oe_Soco','1LdOaIy7IgiA1tclkSzK47rr76Bqyl8FD','1SxX0BCwPMynjMS_Vjo7l0hRNudRsXyES','1mM3jHLPoepmDzVYyIz1GG0IVEN3LL9ns','1tIqpXfZIB5-5Xie90zurCk09p203j8Xg'] },
    'و': { ids: ['1nLc0dnqvPOE0tvo2LUMGkd1K9bTx-PWU','1mwIPBT_ldRm-jbotmAwmnBR3i7YEiQiB','1hB-biOVfjRCnwirGwWdwaxSXelqwl5B7','1OQsycvWzHHo_ZpXzhJsdZ2hKHG4U1uDu','1pU-LsgiCbfddiyJWsPQ2FH2YM8DicFvE','1daZmJxSHx7BHG2fxumQhbMIPx7p26ONr'] },
    'ہ': { ids: ['1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk','1naD0DJQdBuA_FT4u5fZb99lnk9q3bH2Z','1vvNnJfmOR21sPqDb8R54hkf0a0V7nzEW','1xXh8_XIm0Kv2efAeP8dGzJyhYCuSW-Rc','1F5MEhwGW_HdY8caPUdiLXw8o_5E4x2Q1','1wCyYHEwFpXmvBMd8IPNPzOWm-Mkp8z-'] },
    'ء': { ids: ['1Ch6G8Q01soUy1NladS7rjMlsO3tckvGD','1PqycHafOuSsZXXIeCndwoeZ6K1F-bOgq','13vtGg36N4NH62dkZ2U8PBy7vIhvSh5WP'] },
    'ی': { ids: ['1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_','1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA','1crADm-lQIFdM743nuM8dMwPXajYhIXJI','1vwlLaUsf3z4s-LHV27tTA2oJAdanCrFn','1VgbKGs0M585Pgg0Rqj3wo0TwX_nyk2oK'] },
    'ے': { ids: ['1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_','1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA','1crADm-lQIFdM743nuM8dMwPXajYhIXJI','1vwlLaUsf3z4s-LHV27tTA2oJAdanCrFn','1VgbKGs0M585Pgg0Rqj3wo0TwX_nyk2oK'] }
};

function getImageUrl(id) { return `https://drive.google.com/thumbnail?id=${id}&sz=w400`; }
function getRandomImageForLetter(letter) { 
    let imgs = URDU_IMAGES[letter]?.ids; 
    if(!imgs || !imgs.length) return null;
    return getImageUrl(imgs[Math.floor(Math.random() * imgs.length)]);
}

// ========================================== */
// SECTION 2: WORDS DATABASE (BY LEVEL)      
// ========================================== */

const WORDS_BY_LEVEL = {
    easy: ["با","تا","پا","ما","نا","لا","یا","را","کتاب","قلم","میز","باغ","گھر","دوست","پھول","چائے","پانی","دودھ","نان","روٹی","پھل","سبز","نیلا","کالا","لال","بڑا","چھوٹا","مٹھا"],
    medium: ["استاد","سکول","کمرہ","درخت","ریڈیو","چھتری","کھڑکی","بلیاں","پرندہ","تیتلی","مکھن","انگور","کیلے","سنترہ","آم","جامن","ناشپاتی","خوبانی","تربوز","بکری","گاڑی","موبائل"],
    hard: ["تعلیم","صحت","محنت","خوشی","اتحاد","جماعت","ترقی","ہمدردی","انصاف","مساوات","اخوت","رواداری","عاجزی","سچائی","محبت","امن","حسب","نصیب","قسمت"],
    tough: ["کمپیوٹر","ٹیکنالوجی","یونیورسٹی","انجینئر","سائنسدان","فلسفہ","ادبیات","معلومات","آئینہ","ماحولیات","پائیداری","ترجیحات","مشینری","بجلی","روشنی","سہولت","تعمیر","آرکیٹیکچر","اسلامیات","فقہ"]
};

// ========================================== */
// SECTION 3: 20 METHODS LIST                
// ========================================== */

const METHODS_LIST = [
    { id:1, name:"حرف بہ حرف جوڑنا", icon:"🔤", desc:"تصاویر کے ساتھ حروف سیکھیں", questions:38 },
    { id:2, name:"تصویر دیکھ کر لفظ بنانا", icon:"🖼️", desc:"تصویر دیکھیں اور لفظ بنائیں", questions:15 },
    { id:3, name:"شروع کا حرف پہچاننا", icon:"🔍", desc:"تصویر کا پہلا حرف بتائیں", questions:15 },
    { id:4, name:"آخری حرف پہچاننا", icon:"🔚", desc:"لفظ کا آخری حرف پہچانیں", questions:15 },
    { id:5, name:"مکسڈ اپ حروف ترتیب دینا", icon:"🔄", desc:"بکھرے حروف کو صحیح ترتیب دیں", questions:15 },
    { id:6, name:"ملتے جلتے حروف میں فرق", icon:"⚖️", desc:"س، ش، ز، ذ میں فرق کریں", questions:12 },
    { id:7, name:"فلیش کارڈز", icon:"🃏", desc:"تصویری فلیش کارڈز سے مشق", questions:38 },
    { id:8, name:"خالی جگہ پر کریں", icon:"❓", desc:"غائب حرف تلاش کریں", questions:15 },
    { id:9, name:"دو حرفی الفاظ", icon:"🔡", desc:"صرف دو حروف سے لفظ بنائیں", questions:20 },
    { id:10, name:"تین حرفی الفاظ", icon:"🔠", desc:"تین حروف سے الفاظ بنانا", questions:20 },
    { id:11, name:"چھپی ہوئی تصویر", icon:"🎁", desc:"حروف جوڑیں، تصویر کھلے", questions:15 },
    { id:12, name:"میچنگ گیم", icon:"🎯", desc:"تصویر کو لفظ سے جوڑیں", questions:15 },
    { id:14, name:"ابتدائی/وسطی شکل", icon:"🎨", desc:"حرف کی شکلیں پہچانیں", questions:20 },
    { id:15, name:"ٹوٹے حروف کو جوڑنا", icon:"🧩", desc:"بکھرے حروف کو ترتیب دیں", questions:15 },
    { id:16, name:"دائیں سے بائیں جوڑ", icon:"➡️", desc:"اردو اصول کے مطابق جوڑیں", questions:15 },
    { id:17, name:"بغیر ملاوٹ والے حروف", icon:"🚫", desc:"ا، د، ذ، ر، ز، و کو پہچانیں", questions:15 },
    { id:18, name:"مکمل ملاوٹ والے حروف", icon:"🔗", desc:"ب، پ، ت، ٹ، ج، چ کی مشق", questions:15 },
    { id:19, name:"ڈریگ اینڈ ڈراپ", icon:"🖱️", desc:"گھسیٹ کر لفظ بنائیں", questions:15 },
    { id:21, name:"پزل کے ذریعے", icon:"🧩", desc:"پزل ٹکڑے جوڑیں", questions:15 },
    { id:22, name:"جملہ سازی", icon:"📝", desc:"الفاظ سے چھوٹے جملے", questions:15 }
];

// ========================================== */
// SECTION 4: API CONFIGURATION              
// ========================================== */

const TOOL_SLUG = 'magicrills-urdu-jor-tor';
const API_BASE = 'https://magicrills.uzairhameed01.workers.dev/api';

// ========================================== */
// SECTION 5: GAME STATE VARIABLES           
// ========================================== */

let currentLevel = 'easy';
let currentWord = '';
let selectedTiles = [];
let totalScore = 0;
let timeLeft = 60;
let timerInterval = null;
let hintsLeft = 3;
let currentUsage = 0;
let isGameActive = false;

// DOM Elements
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const levelValueEl = document.getElementById('levelValue');
const hintsValueEl = document.getElementById('hintsValue');
const usageCountEl = document.getElementById('usageCount');
const progressFill = document.getElementById('progressFill');
const lettersContainer = document.getElementById('lettersContainer');
const wordDisplay = document.getElementById('wordDisplay');
const gameArea = document.getElementById('gameArea');
const startGameBtn = document.getElementById('startGameBtn');
const checkBtn = document.getElementById('checkBtn');
const clearBtn = document.getElementById('clearBtn');
const hintBtn = document.getElementById('hintBtn');

// ========================================== */
// SECTION 6: UTILITY FUNCTIONS              
// ========================================== */

function showToast(msg, type = 'info') {
    if (typeof Toastify !== 'undefined') {
        Toastify({ text: msg, duration: 2000, gravity: "top", position: "center", style: { background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2563EB' } }).showToast();
    } else { alert(msg); }
}

function shuffleArray(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

// ========================================== */
// SECTION 7: API CALLS                      
// ========================================== */

async function callApi(endpoint, method = 'GET', data = {}) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (method !== 'GET') options.body = JSON.stringify(data);
        const res = await fetch(`${API_BASE}/${endpoint}`, options);
        return await res.json();
    } catch(e) { return null; }
}

async function incrementUsage() {
    const res = await callApi(`${TOOL_SLUG}/usage`, 'POST', { tool_slug: TOOL_SLUG, user_id: 'anonymous' });
    if (res && res.total_usage) { currentUsage = res.total_usage; if(usageCountEl) usageCountEl.textContent = currentUsage; }
}

// ========================================== */
// SECTION 8: REACTIONS & SHARE              
// ========================================== */

let reactionCounts = { like:0, love:0, wow:0, sad:0, angry:0, laugh:0, celebrate:0 };
const emojis = ['👍','❤️','😮','😢','😠','😂','🎉'];
const reactionKeys = ['like','love','wow','sad','angry','laugh','celebrate'];

async function loadReactions() { let data = await callApi(`${TOOL_SLUG}/reactions`); if(data?.reactions) reactionCounts = data.reactions; renderReactions(); }
async function addReaction(emoji, type) { await callApi(`${TOOL_SLUG}/reactions`, 'POST', { tool_slug: TOOL_SLUG, emoji, reaction_type: type, user_id: 'anonymous' }); showToast('شکریہ!', 'success'); loadReactions(); }

function renderReactions() {
    const container = document.getElementById('emojiContainer');
    if(!container) return;
    container.innerHTML = emojis.map((emoji, idx) => `<button class="emoji-btn" data-emoji="${emoji}" data-type="${reactionKeys[idx]}">${emoji}<span class="emoji-count">${reactionCounts[reactionKeys[idx]]||0}</span></button>`).join('');
    document.querySelectorAll('.emoji-btn').forEach(btn => btn.addEventListener('click', () => addReaction(btn.dataset.emoji, btn.dataset.type)));
}

async function trackShare(platform) { await callApi(`${TOOL_SLUG}/shares`, 'POST', { tool_slug: TOOL_SLUG, platform, user_id: 'anonymous' }); }
function shareOn(platform) {
    const url = encodeURIComponent(window.location.href);
    const urls = { facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`, twitter: `https://twitter.com/intent/tweet?u=${url}`, whatsapp: `https://api.whatsapp.com/send?text=${url}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?u=${url}` };
    if(urls[platform]) window.open(urls[platform], '_blank');
    trackShare(platform); showToast('شیئر کیا گیا!', 'success');
}

// ========================================== */
// SECTION 9: GAME FUNCTIONS                 
// ========================================== */

function getMaxTime() { return currentLevel === 'easy' ? 60 : currentLevel === 'medium' ? 45 : currentLevel === 'hard' ? 30 : 20; }
function getPoints() { return currentLevel === 'easy' ? 10 : currentLevel === 'medium' ? 20 : currentLevel === 'hard' ? 30 : 50; }

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if(!isGameActive) return;
        if(timeLeft <= 0) { clearInterval(timerInterval); showToast('⏰ وقت ختم! نیا لفظ', 'error'); generateNewWord(); }
        else { timeLeft--; timerEl.textContent = timeLeft; progressFill.style.width = `${(timeLeft / getMaxTime()) * 100}%`; }
    }, 1000);
}

function generateNewWord() {
    if(!isGameActive) return;
    const words = WORDS_BY_LEVEL[currentLevel];
    currentWord = words[Math.floor(Math.random() * words.length)];
    let letters = currentWord.split('');
    const extras = ['ا','ب','م','ل','و','ی','ن','ر','ک','ت'];
    for(let i=0;i<3;i++) letters.push(extras[Math.floor(Math.random() * extras.length)]);
    letters = shuffleArray(letters);
    lettersContainer.innerHTML = '';
    letters.forEach(letter => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.onclick = () => { 
            if(!isGameActive) return;
            tile.classList.toggle('selected'); 
            selectedTiles.includes(tile) ? selectedTiles = selectedTiles.filter(t => t !== tile) : selectedTiles.push(tile); 
            updateWordDisplay(); 
        };
        lettersContainer.appendChild(tile);
    });
    selectedTiles = [];
    updateWordDisplay();
    timeLeft = getMaxTime(); timerEl.textContent = timeLeft;
    if(isGameActive) startTimer();
}

function updateWordDisplay() { 
    wordDisplay.innerHTML = selectedTiles.length ? selectedTiles.map(t => `<span style="background:rgba(37,99,235,0.15);padding:8px 15px;border-radius:20px;">${t.textContent}</span>`).join('') : '<span class="placeholder">✨ حروف منتخب کریں...</span>'; 
}

function checkWord() {
    if(!isGameActive) { showToast('پہلے گیم شروع کریں!', 'error'); return; }
    const userWord = selectedTiles.map(t => t.textContent).join('');
    if(userWord === currentWord) {
        document.getElementById('correctSound').play();
        totalScore += getPoints(); scoreEl.textContent = totalScore;
        showToast('✔️ مبارک! لفظ درست ہے! +' + getPoints() + ' پوائنٹس', 'success');
        for(let i=0;i<15;i++) { let conf = document.createElement('div'); conf.innerHTML = ['🎉','🏆','🎈','⭐','🌟'][Math.floor(Math.random()*5)]; conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:20%;font-size:2rem;pointer-events:none;animation:floatUp 1.5s forwards;z-index:1000;`; document.body.appendChild(conf); setTimeout(()=>conf.remove(),1500); }
        generateNewWord();
    } else { 
        document.getElementById('wrongSound').play(); 
        showToast('❌ غلط جواب! دوبارہ کوشش کریں', 'error'); 
        selectedTiles.forEach(t => { t.style.animation = 'shake 0.3s'; setTimeout(()=>t.style.animation='',300); }); 
    }
}

function clearSelection() { if(!isGameActive) return; selectedTiles.forEach(t => t.classList.remove('selected')); selectedTiles = []; updateWordDisplay(); }

function giveHint() {
    if(!isGameActive) { showToast('پہلے گیم شروع کریں!', 'error'); return; }
    if(hintsLeft <= 0) { showToast('مدد ختم!', 'error'); return; }
    hintsLeft--; hintsValueEl.textContent = hintsLeft;
    const currentLetters = selectedTiles.map(t => t.textContent);
    for(let char of currentWord) { if(!currentLetters.includes(char)) { let tile = [...document.querySelectorAll('.letter-tile')].find(t => t.textContent === char); if(tile) { tile.style.background = '#F59E0B'; setTimeout(()=>tile.style.background='',1000); showToast(`💡 مدد: "${char}" شامل کریں`, 'info'); break; } } }
}

function changeLevel(level) {
    currentLevel = level;
    levelValueEl.textContent = { easy:'آسان (2-3 حروف)', medium:'درمیانہ (3-4 حروف)', hard:'مشکل (4-5 حروف)', tough:'بہت مشکل (5-6 حروف)' }[level];
    if(isGameActive) {
        totalScore = 0; hintsLeft = 3;
        scoreEl.textContent = totalScore; hintsValueEl.textContent = hintsLeft;
        generateNewWord();
    }
}

function startGame() {
    if(isGameActive) return;
    isGameActive = true;
    gameArea.classList.remove('disabled');
    checkBtn.disabled = false;
    clearBtn.disabled = false;
    hintBtn.disabled = false;
    totalScore = 0;
    hintsLeft = 3;
    scoreEl.textContent = totalScore;
    hintsValueEl.textContent = hintsLeft;
    showToast('🎮 گیم شروع ہو گئی! لفظ بنائیں', 'success');
    generateNewWord();
}

// ========================================== */
// SECTION 10: METHOD 1 - حرف بہ حرف جوڑنا   
// ========================================== */

function method1_HarfBaHarf() {
    // Complete Urdu letters with their half forms
    const lettersDatabase = [
        { full: 'ا', half: 'ﺍ', name: 'الف' },
        { full: 'ب', half: 'ﺏ', name: 'بے' },
        { full: 'پ', half: 'ﭖ', name: 'پے' },
        { full: 'ت', half: 'ﺕ', name: 'تے' },
        { full: 'ٹ', half: 'ﭦ', name: 'ٹے' },
        { full: 'ث', half: 'ﺙ', name: 'ثے' },
        { full: 'ج', half: 'ﺝ', name: 'جیم' },
        { full: 'چ', half: 'ﭺ', name: 'چے' },
        { full: 'ح', half: 'ﺡ', name: 'حے' },
        { full: 'خ', half: 'ﺥ', name: 'خے' },
        { full: 'د', half: 'ﺩ', name: 'دال' },
        { full: 'ڈ', half: 'ﮈ', name: 'ڈال' },
        { full: 'ذ', half: 'ﺫ', name: 'ذال' },
        { full: 'ر', half: 'ﺭ', name: 'رے' },
        { full: 'ڑ', half: 'ﮍ', name: 'ڑے' },
        { full: 'ز', half: 'ﺯ', name: 'زے' },
        { full: 'س', half: 'ﺱ', name: 'سین' },
        { full: 'ش', half: 'ﺵ', name: 'شین' },
        { full: 'ص', half: 'ﺹ', name: 'صاد' },
        { full: 'ض', half: 'ﺽ', name: 'ضاد' },
        { full: 'ط', half: 'ﻁ', name: 'طوئے' },
        { full: 'ظ', half: 'ﻅ', name: 'ظوئے' },
        { full: 'ع', half: 'ﻉ', name: 'عین' },
        { full: 'غ', half: 'ﻍ', name: 'غین' },
        { full: 'ف', half: 'ﻑ', name: 'فے' },
        { full: 'ق', half: 'ﻕ', name: 'قاف' },
        { full: 'ک', half: 'ﮎ', name: 'کاف' },
        { full: 'گ', half: 'ﮒ', name: 'گاف' },
        { full: 'ل', half: 'ﻝ', name: 'لام' },
        { full: 'م', half: 'ﻡ', name: 'میم' },
        { full: 'ن', half: 'ﻥ', name: 'نون' },
        { full: 'و', half: 'ﻭ', name: 'واؤ' },
        { full: 'ہ', half: 'ﮨ', name: 'ہے' },
        { full: 'ء', half: 'ﺀ', name: 'ہمزہ' },
        { full: 'ی', half: 'ﯼ', name: 'یے' },
        { full: 'ے', half: 'ﮯ', name: 'بڑی یے' }
    ];
    
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15;
        const shuffled = shuffleArray([...lettersDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let usedOptions = new Set();
    
    function generateUniqueOptions(correctHalf, allLetters) {
        let options = [correctHalf];
        const available = allLetters.filter(l => l.half !== correctHalf && !usedOptions.has(l.half));
        const shuffledAvailable = shuffleArray([...available]);
        while(options.length < 4 && shuffledAvailable.length > 0) {
            const candidate = shuffledAvailable.pop();
            if(!options.includes(candidate.half)) options.push(candidate.half);
        }
        while(options.length < 4) {
            const random = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(!options.includes(random.half)) options.push(random.half);
        }
        usedOptions.add(correctHalf);
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const options = generateUniqueOptions(current.half, lettersDatabase);
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">📖 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 40px 20px; margin: 20px 0;">
                    <div style="font-size: 1.2rem; color: #FCD34D; margin-bottom: 15px;">✨ اس حرف کا دوسرا حصہ کون سا ہے؟ ✨</div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                        <div style="background: rgba(255,255,255,0.15); border-radius: 25px; padding: 20px; min-width: 150px;">
                            <div style="font-size: 0.9rem; color: #93C5FD;">پہلا حصہ</div>
                            <div style="font-size: 5rem; font-weight: bold; color: white;">${current.full}</div>
                        </div>
                        <div style="font-size: 2rem; color: #FCD34D;">+</div>
                        <div style="background: rgba(255,255,255,0.1); border-radius: 25px; padding: 20px; border: 2px dashed rgba(255,255,255,0.3); min-width: 150px;">
                            <div style="font-size: 0.9rem; color: #93C5FD;">دوسرا حصہ (؟)</div>
                            <div style="font-size: 5rem; font-weight: bold; color: #FCD34D;">?</div>
                        </div>
                    </div>
                </div>
                <h3 style="color: #2563EB;">صحیح دوسرا حصہ منتخب کریں</h3>
                <div id="halfOptions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; max-width: 500px; margin: 20px auto;"></div>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button id="prevHalfBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextHalfBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('halfOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2.5rem;">${opt}</div><div style="font-size: 0.7rem;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 15px 10px; cursor: pointer;';
            btn.onclick = () => {
                if(opt === current.half) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast('🎉 شاباش! بالکل صحیح جوڑ دیا!', 'success');
                    document.querySelectorAll('#halfOptions button').forEach(b => { b.style.pointerEvents = 'none'; b.style.opacity = '0.7'; });
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); }
                        else { finishQuiz(); }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast('❌ غلط! دوبارہ کوشش کریں', 'error');
                    btn.style.background = '#EF4444';
                    setTimeout(() => btn.style.background = 'linear-gradient(135deg, #10B981, #059669)', 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        document.getElementById('prevHalfBtn').onclick = () => { if(currentIndex > 0) { currentIndex--; renderQuestion(); } else { showToast('یہ پہلا سوال ہے!', 'info'); } };
        document.getElementById('nextHalfBtn').onclick = () => { if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); } else { showToast('یہ آخری سوال ہے!', 'info'); } };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem;">🏆</div>
                <h3>مبارک ہو!</h3>
                <p>آپ نے ${totalQuestions} میں سے ${score} سوالات صحیح کیے (${percentage}%)</p>
                <button id="finishQuizBtn" style="background:#10B981; color:white; padding:12px 30px; border:none; border-radius:60px; cursor:pointer;">✅ مکمل کیا</button>
            </div>
        `;
        document.getElementById('finishQuizBtn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس!`, 'success');
        };
    }
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}

// ========================================== */
// SECTION 11: METHOD 2 - تصویر دیکھ کر لفظ بنانا
// ========================================== */

function method2_ImageToWord() {
    const imageWords = [
        { id: "1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_", word: "احمد", name: "احمد", hint: "ایک نام" },
        { id: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk", word: "انار", name: "انار", hint: "سرخ رنگ کا پھل" },
        { id: "1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_", word: "انجیر", name: "انجیر", hint: "میٹھا پھل" },
        { id: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz", word: "اونٹ", name: "اونٹ", hint: "صحرا کا جانور" },
        { id: "11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe", word: "انگلی", name: "انگلی", hint: "ہاتھ کی" },
        { id: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6", word: "انگور", name: "انگور", hint: "چھوٹے میٹھے پھل" },
        { id: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd", word: "آلو", name: "آلو", hint: "سبزی" },
        { id: "1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE", word: "آڑو", name: "آڑو", hint: "رس دار پھل" },
        { id: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF", word: "آم", name: "آم", hint: "بادشاہ پھل" },
        { id: "1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_", word: "آلو بخارہ", name: "آلو بخارہ", hint: "کھٹا میٹھا پھل" },
        { id: "1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt", word: "آگ", name: "آگ", hint: "گرم اور روشن" },
        { id: "1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D", word: "آنکھ", name: "آنکھ", hint: "دیکھنے والا عضو" },
        { id: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX", word: "بیل", name: "بیل", hint: "ہل چلانے والا جانور" },
        { id: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-", word: "بکری", name: "بکری", hint: "دودھ دینے والی" },
        { id: "1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m", word: "بطخ", name: "بطخ", hint: "پانی کا پرندہ" },
        { id: "1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK", word: "بندر", name: "بندر", hint: "درختوں پر رہنے والا" },
        { id: "195uQPWZsukNoAkVDipAdzStzStdOeAWH", word: "بلی", name: "بلی", hint: "میاؤں میاؤں" },
        { id: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x", word: "بلبل", name: "بلبل", hint: "میٹھا گانے والا پرندہ" }
    ];
    
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) {}
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10;
        const shuffled = shuffleArray([...imageWords]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const wordLetters = current.word.split('');
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.id}&sz=w400`;
        const extraLetters = ['ا', 'ب', 'م', 'ل', 'و', 'ی', 'ن', 'ر', 'ک', 'ت'];
        let letterPool = [...wordLetters];
        for(let i = 0; i < 3; i++) {
            let randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            while(letterPool.includes(randomExtra)) randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            letterPool.push(randomExtra);
        }
        letterPool = shuffleArray(letterPool);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">📸 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <img src="${imageUrl}" style="width: 160px; height: 160px; object-fit: cover; border-radius: 25px; border: 3px solid white;">
                    <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 12px 20px; margin: 15px auto; display: inline-block;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">🔤 اس چیز کا نام ہے:</div>
                        <div style="font-size: 2rem; font-weight: bold; color: #FCD34D;">${current.name}</div>
                    </div>
                </div>
                <h3>📝 نیچے سے حروف چن کر لفظ بنائیں: "${current.name}"</h3>
                <div id="wordBuildArea" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; min-height: 90px; background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    ${wordLetters.map((_, idx) => `<div id="slot_${idx}" style="width: 70px; height: 70px; background: white; border: 2px solid #2563EB; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem;"></div>`).join('')}
                </div>
                <div id="letterPool" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin: 20px 0;"></div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearWordBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkWordBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevImgBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextImgBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const letterPoolDiv = document.getElementById('letterPool');
        letterPool.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 20px; font-size: 2rem; cursor: pointer;';
            btn.onclick = () => {
                for(let i = 0; i < wordLetters.length; i++) {
                    const slot = document.getElementById(`slot_${i}`);
                    if(slot.textContent === '') {
                        slot.textContent = letter;
                        slot.style.background = '#D1FAE5';
                        btn.style.opacity = '0.5';
                        btn.style.pointerEvents = 'none';
                        break;
                    }
                }
            };
            letterPoolDiv.appendChild(btn);
        });
        
        document.getElementById('clearWordBtn').onclick = () => {
            for(let i = 0; i < wordLetters.length; i++) {
                const slot = document.getElementById(`slot_${i}`);
                slot.textContent = '';
                slot.style.background = 'white';
            }
            document.querySelectorAll('#letterPool button').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
        };
        
        document.getElementById('checkWordBtn').onclick = () => {
            let userWord = '';
            for(let i = 0; i < wordLetters.length; i++) userWord += document.getElementById(`slot_${i}`).textContent;
            if(userWord === current.word) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! "${current.name}" لفظ درست بنایا!`, 'success');
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); }
                    else { finishQuiz(); }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح لفظ "${current.word}" ہے`, 'error');
            }
        };
        
        document.getElementById('prevImgBtn').onclick = () => { if(currentIndex > 0) { currentIndex--; renderQuestion(); } };
        document.getElementById('nextImgBtn').onclick = () => { if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); } };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem;">🏆</div>
                <h3>مبارک ہو!</h3>
                <p>آپ نے ${totalQuestions} میں سے ${score} لفظ صحیح بنائے (${percentage}%)</p>
                <button id="finishMethod2Btn" style="background:#10B981; color:white; padding:12px 30px; border:none; border-radius:60px; cursor:pointer;">✅ مکمل کیا</button>
            </div>
        `;
        document.getElementById('finishMethod2Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس!`, 'success');
        };
    }
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}

// ========================================== */
// SECTION 12: METHOD 3 - شروع کا حرف پہچاننا
// ========================================== */

function method3_FirstLetter() {
    const imageWords = [
        { id: "1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_", word: "احمد", firstLetter: "ا", name: "احمد", hint: "ایک نام" },
        { id: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk", word: "انار", firstLetter: "ا", name: "انار", hint: "سرخ رنگ کا پھل" },
        { id: "1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_", word: "انجیر", firstLetter: "ا", name: "انجیر", hint: "میٹھا پھل" },
        { id: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz", word: "اونٹ", firstLetter: "ا", name: "اونٹ", hint: "صحرا کا جانور" },
        { id: "11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe", word: "انگلی", firstLetter: "ا", name: "انگلی", hint: "ہاتھ کی" },
        { id: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6", word: "انگور", firstLetter: "ا", name: "انگور", hint: "چھوٹے میٹھے پھل" },
        { id: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd", word: "آلو", firstLetter: "آ", name: "آلو", hint: "سبزی" },
        { id: "1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE", word: "آڑو", firstLetter: "آ", name: "آڑو", hint: "رس دار پھل" },
        { id: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF", word: "آم", firstLetter: "آ", name: "آم", hint: "بادشاہ پھل" },
        { id: "1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_", word: "آلو بخارہ", firstLetter: "آ", name: "آلو بخارہ", hint: "کھٹا میٹھا پھل" },
        { id: "1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt", word: "آگ", firstLetter: "آ", name: "آگ", hint: "گرم اور روشن" },
        { id: "1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D", word: "آنکھ", firstLetter: "آ", name: "آنکھ", hint: "دیکھنے والا عضو" },
        { id: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX", word: "بیل", firstLetter: "ب", name: "بیل", hint: "ہل چلانے والا جانور" },
        { id: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-", word: "بکری", firstLetter: "ب", name: "بکری", hint: "دودھ دینے والی" },
        { id: "1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m", word: "بطخ", firstLetter: "ب", name: "بطخ", hint: "پانی کا پرندہ" },
        { id: "1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK", word: "بندر", firstLetter: "ب", name: "بندر", hint: "درختوں پر رہنے والا" },
        { id: "195uQPWZsukNoAkVDipAdzStzStdOeAWH", word: "بلی", firstLetter: "ب", name: "بلی", hint: "میاؤں میاؤں" },
        { id: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x", word: "بلبل", firstLetter: "ب", name: "بلبل", hint: "میٹھا گانے والا پرندہ" }
    ];
    
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) {}
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10;
        const shuffled = shuffleArray([...imageWords]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctLetter) {
        const allLetters = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ء', 'ی', 'ے'];
        let options = [correctLetter];
        while(options.length < 4) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(!options.includes(randomLetter)) options.push(randomLetter);
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.id}&sz=w400`;
        const options = generateOptions(current.firstLetter);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🔤 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <img src="${imageUrl}" style="width: 160px; height: 160px; object-fit: cover; border-radius: 25px; border: 3px solid white;">
                    <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 12px 20px; margin: 15px auto; display: inline-block;">
                        <div style="font-size: 1.8rem; font-weight: bold; color: #FCD34D;">${current.name}</div>
                    </div>
                </div>
                <h3>❓ اس کا <span style="color:#F59E0B;">پہلا حرف</span> کیا ہے؟</h3>
                <div id="firstLetterOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 400px; margin: 20px auto;"></div>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button id="prevFirstBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextFirstBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('firstLetterOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2.5rem;">${opt}</div><div style="font-size: 0.7rem;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer;';
            btn.onclick = () => {
                if(opt === current.firstLetter) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${current.name}" کا پہلا حرف "${opt}" ہے!`, 'success');
                    document.querySelectorAll('#firstLetterOptions button').forEach(b => { b.style.pointerEvents = 'none'; b.style.opacity = '0.7'; });
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); }
                        else { finishQuiz(); }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! "${current.name}" کا پہلا حرف "${current.firstLetter}" ہے`, 'error');
                    btn.style.background = '#EF4444';
                    setTimeout(() => btn.style.background = 'linear-gradient(135deg, #10B981, #059669)', 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        document.getElementById('prevFirstBtn').onclick = () => { if(currentIndex > 0) { currentIndex--; renderQuestion(); } };
        document.getElementById('nextFirstBtn').onclick = () => { if(currentIndex + 1 < totalQuestions) { currentIndex++; renderQuestion(); } };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem;">🏆</div>
                <h3>مبارک ہو!</h3>
                <p>آپ نے ${totalQuestions} میں سے ${score} پہلے حروف درست پہچانے (${percentage}%)</p>
                <button id="finishMethod3Btn" style="background:#10B981; color:white; padding:12px 30px; border:none; border-radius:60px; cursor:pointer;">✅ مکمل کیا</button>
            </div>
        `;
        document.getElementById('finishMethod3Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس!`, 'success');
        };
    }
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}

// ========================================== */
// SECTION 13: METHOD 4 - آخری حرف پہچاننا
// ========================================== */

// ========================================== */
// SECTION 13: METHOD 4 - آخری حرف پہچاننا
// (Last Letter Recognition)
// تصویر دیکھیں | بتائیں کہ اس کا آخری حرف کیا ہے
// 10-15 Random Questions | No Repeat
// ========================================== */

function method4_LastLetter() {
    // ==========================================
    // AUTHENTIC IMAGE-WORD DATABASE (From Google Drive)
    // Each word with its LAST LETTER
    // ==========================================
    
    const imageWords = [
        // حرف: الف (آخری حرف)
        { id: "1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_", word: "احمد", lastLetter: "د", name: "احمد", hint: "ایک نام" },
        { id: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk", word: "انار", lastLetter: "ر", name: "انار", hint: "سرخ رنگ کا پھل" },
        { id: "1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_", word: "انجیر", lastLetter: "ر", name: "انجیر", hint: "میٹھا پھل" },
        { id: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz", word: "اونٹ", lastLetter: "ٹ", name: "اونٹ", hint: "صحرا کا جانور" },
        { id: "11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe", word: "انگلی", lastLetter: "ی", name: "انگلی", hint: "ہاتھ کی" },
        { id: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6", word: "انگور", lastLetter: "ر", name: "انگور", hint: "چھوٹے میٹھے پھل" },
        
        // حرف: آ (آخری حرف)
        { id: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd", word: "آلو", lastLetter: "و", name: "آلو", hint: "سبزی" },
        { id: "1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE", word: "آڑو", lastLetter: "و", name: "آڑو", hint: "رس دار پھل" },
        { id: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF", word: "آم", lastLetter: "م", name: "آم", hint: "بادشاہ پھل" },
        { id: "1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_", word: "آلو بخارہ", lastLetter: "ہ", name: "آلو بخارہ", hint: "کھٹا میٹھا پھل" },
        { id: "1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt", word: "آگ", lastLetter: "گ", name: "آگ", hint: "گرم اور روشن" },
        { id: "1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D", word: "آنکھ", lastLetter: "ھ", name: "آنکھ", hint: "دیکھنے والا عضو" },
        
        // حرف: ب (آخری حرف)
        { id: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX", word: "بیل", lastLetter: "ل", name: "بیل", hint: "ہل چلانے والا جانور" },
        { id: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-", word: "بکری", lastLetter: "ی", name: "بکری", hint: "دودھ دینے والی" },
        { id: "1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m", word: "بطخ", lastLetter: "خ", name: "بطخ", hint: "پانی کا پرندہ" },
        { id: "1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK", word: "بندر", lastLetter: "ر", name: "بندر", hint: "درختوں پر رہنے والا" },
        { id: "195uQPWZsukNoAkVDipAdzStzStdOeAWH", word: "بلی", lastLetter: "ی", name: "بلی", hint: "میاؤں میاؤں" },
        { id: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x", word: "بلبل", lastLetter: "ل", name: "بلبل", hint: "میٹھا گانے والا پرندہ" },
        
        // حرف: پ (آخری حرف)
        { id: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc", word: "پودا", lastLetter: "ا", name: "پودا", hint: "چھوٹا درخت" },
        { id: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg", word: "پیاز", lastLetter: "ز", name: "پیاز", hint: "آنکھ میں آنسو لائے" },
        { id: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz", word: "پنکھا", lastLetter: "ا", name: "پنکھا", hint: "ہوا کرنے والا" },
        { id: "100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd", word: "پنسل", lastLetter: "ل", name: "پنسل", hint: "لکھنے والی چیز" },
        { id: "19qLMks_EOThEtcIRtBLozpE70g9cf7An", word: "پتا", lastLetter: "ا", name: "پتا", hint: "درخت کا حصہ" },
        { id: "14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-", word: "پانی", lastLetter: "ی", name: "پانی", hint: "جو ہم پیتے ہیں" },
        
        // حرف: ت (آخری حرف)
        { id: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO", word: "تربوز", lastLetter: "ز", name: "تربوز", hint: "بڑا میٹھا پھل" },
        { id: "1Z-NOMx_OaoKeVGlgYnBu-QEoElGkybf6", word: "تیل", lastLetter: "ل", name: "تیل", hint: "کھانا پکانے میں" },
        { id: "1MnTDH0BzIwo34UU48Xq0vYZnLtnpTHmr", word: "ترازو", lastLetter: "و", name: "ترازو", hint: "وزن ناپنے والا" },
        { id: "17DGLNryxH1EN6dVANlrN20yWQK2i0-Mw", word: "تتلی", lastLetter: "ی", name: "تتلی", hint: "رنگ برنگا کیڑا" },
        { id: "1c6kNYLkxGwUTX2YhVvNxI_bpcDrskU6j", word: "تالا", lastLetter: "ا", name: "تالا", hint: "چابی سے کھلتا ہے" },
        { id: "1NC365naAm8JHitPLEDeUh-_TxbNmD5G9", word: "تلوار", lastLetter: "ر", name: "تلوار", hint: "جنگ کا ہتھیار" },
        
        // حرف: ٹ (آخری حرف)
        { id: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq", word: "ٹوپی", lastLetter: "ی", name: "ٹوپی", hint: "سر پر پہنتے ہیں" },
        { id: "1UittBNOLlrxEfvMbpW7r8X7T84qMlTGv", word: "ٹرک", lastLetter: "ک", name: "ٹرک", hint: "بڑی گاڑی" },
        { id: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c", word: "ٹماٹر", lastLetter: "ر", name: "ٹماٹر", hint: "سرخ سبزی" },
        { id: "11VifEs64W1Axpwwt5E4o_sJlIjBQJkqs", word: "ٹوکری", lastLetter: "ی", name: "ٹوکری", hint: "چیزیں رکھنے والی" },
        { id: "17ylMaYjX7vFJboJVKvRIws6FhDhVZL22", word: "ٹڈا", lastLetter: "ا", name: "ٹڈا", hint: "پھدکنے والا کیڑا" },
        { id: "1eUvRzibJks-79mNK0Q10t2gyi0cvsFrJ", word: "ٹیلی فون", lastLetter: "ن", name: "ٹیلی فون", hint: "بات کرنے کا آلہ" },
        
        // حرف: ث (آخری حرف)
        { id: "1x0jwx6_7151_UeTigefA0mBCZT8hXgPP", word: "ثمر", lastLetter: "ر", name: "ثمر", hint: "پھل" },
        
        // حرف: ج (آخری حرف)
        { id: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa", word: "جوتا", lastLetter: "ا", name: "جوتا", hint: "پاؤں میں پہنتے ہیں" },
        { id: "11HsvqUk06h0H7vmQqEgMHdmjFNOPg_PK", word: "جیکٹ", lastLetter: "ٹ", name: "جیکٹ", hint: "سردی سے بچانے والی" },
        { id: "1llIMwlyvf9WjWmDjxXfuD8ouRBA2mnI9", word: "جگ", lastLetter: "گ", name: "جگ", hint: "پانی رکھنے والا" },
        { id: "15biUB_wgBq_Fr2gu5C5N6eQq2Zb2IuXZ", word: "جوس", lastLetter: "س", name: "جوس", hint: "پھلوں کا رس" },
        { id: "1usD2b4RLTJXvdAS41h2wmZpdxjAiH4Te", word: "جلیبی", lastLetter: "ی", name: "جلیبی", hint: "میٹھا" },
        { id: "1zZR_yASFBnyxhPram_tfUmlc0WOqegLQ", word: "جہاز", lastLetter: "ز", name: "جہاز", hint: "ہوا میں اڑنے والا" },
        
        // حرف: چ (آخری حرف)
        { id: "1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z", word: "چوہا", lastLetter: "ا", name: "چوہا", hint: "چھوٹا جانور" },
        { id: "1ggt5YNF-oGOcjJpewu2_s-OaEiIjYIPx", word: "چاول", lastLetter: "ل", name: "چاول", hint: "کھانے کا دانہ" },
        { id: "1iGPRmcpngUQoh4xh0IN3tG4TAsY1Hmpb", word: "چڑیا", lastLetter: "ا", name: "چڑیا", hint: "چہچہانے والا پرندہ" },
        { id: "1IgX1hY_vwqUQGE95PUjKAWNt9mWoOfOf", word: "چورہ", lastLetter: "ہ", name: "چورہ", hint: "بچا ہوا کھانا" },
        { id: "1Mz4HxGs_2u11UScOsadkYSB9RtLLUxHL", word: "چاند", lastLetter: "د", name: "چاند", hint: "رات کو چمکتا ہے" },
        { id: "13S5ak1Mv-Chr8QA2QljayPIaNuz43NU2", word: "چینی", lastLetter: "ی", name: "چینی", hint: "میٹھی" }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...imageWords]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctLetter) {
        const allLetters = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے'];
        let options = [correctLetter];
        
        while(options.length < 4) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.id}&sz=w400`;
        const options = generateOptions(current.lastLetter);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🔚 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ تصویر دیکھیں ✨</div>
                    <img src="${imageUrl}" style="width: 160px; height: 160px; object-fit: cover; border-radius: 25px; border: 3px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"
                         onerror="this.src='https://via.placeholder.com/160x160/2563EB/white?text=${current.name}'">
                    
                    <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 12px 20px; margin: 15px auto; display: inline-block; backdrop-filter: blur(5px);">
                        <div style="font-size: 0.8rem; color: #93C5FD;">🔤 اس چیز کا نام ہے:</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #FCD34D;">${current.name}</div>
                    </div>
                    
                    <div style="font-size: 0.75rem; color: #93C5FD; margin-top: 8px;">💡 ${current.hint}</div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">❓ اس کا <span style="color:#F59E0B; font-size:1.3rem;">آخری حرف</span> کیا ہے؟</h3>
                
                <div id="lastLetterOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 400px; margin: 20px auto;"></div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevLastBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <span>◀</span> پچھلا
                    </button>
                    <button id="nextLastBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        اگلا <span>▶</span>
                    </button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('lastLetterOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2.5rem;">${opt}</div><div style="font-size: 0.7rem; margin-top: 5px;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer; transition: all 0.2s; text-align: center;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === current.lastLetter) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${current.name}" کا آخری حرف "${opt}" ہے! 🎉`, 'success');
                    
                    document.querySelectorAll('#lastLetterOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! "${current.name}" کا آخری حرف "${current.lastLetter}" ہے`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevLastBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextLastBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب آخری حروف درست پہچانے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> آخری حروف درست پہچانے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod4Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod4Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🔚'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 14: METHOD 5 - مکسڈ اپ حروف
// ========================================== */
// ========================================== */
// SECTION 14: METHOD 5 - مکسڈ اپ حروف ترتیب دینا
// (Rearrange Mixed Letters to Make Correct Word)
// بکھرے ہوئے حروف کو صحیح ترتیب میں لگائیں
// 10-15 Random Questions | No Repeat
// ========================================== */

function method5_MixedUp() {
    // ==========================================
    // WORDS DATABASE with their letters
    // Each word will be shown as mixed letters
    // ==========================================
    
    const wordsDatabase = [
        { word: "کتاب", name: "کتاب", hint: "جس میں ہم پڑھتے ہیں", imageLetter: "ک" },
        { word: "قلم", name: "قلم", hint: "جس سے ہم لکھتے ہیں", imageLetter: "ق" },
        { word: "میز", name: "میز", hint: "جس پر ہم کھانا کھاتے ہیں", imageLetter: "م" },
        { word: "باغ", name: "باغ", hint: "جہاں پھول اور درخت ہوں", imageLetter: "ب" },
        { word: "گھر", name: "گھر", hint: "جہاں ہم رہتے ہیں", imageLetter: "گ" },
        { word: "دوست", name: "دوست", hint: "جو ہمارے ساتھ کھیلے", imageLetter: "د" },
        { word: "پھول", name: "پھول", hint: "جو باغ میں کھلتا ہے", imageLetter: "پ" },
        { word: "چائے", name: "چائے", hint: "گرم گرم پینے والی چیز", imageLetter: "چ" },
        { word: "پانی", name: "پانی", hint: "جو ہم پیتے ہیں", imageLetter: "پ" },
        { word: "دودھ", name: "دودھ", hint: "سفید رنگ کا مشروب", imageLetter: "د" },
        { word: "روٹی", name: "روٹی", hint: "جو ہم کھاتے ہیں", imageLetter: "ر" },
        { word: "بکری", name: "بکری", hint: "دودھ دینے والی", imageLetter: "ب" },
        { word: "شیر", name: "شیر", hint: "جنگل کا بادشاہ", imageLetter: "ش" },
        { word: "توتا", name: "توتا", hint: "سبز رنگ کا پرندہ", imageLetter: "ت" },
        { word: "انار", name: "انار", hint: "سرخ رنگ کا پھل", imageLetter: "ا" },
        { word: "آم", name: "آم", hint: "بادشاہ پھل", imageLetter: "آ" },
        { word: "انگور", name: "انگور", hint: "چھوٹے میٹھے پھل", imageLetter: "ا" },
        { word: "سکول", name: "سکول", hint: "جہاں ہم پڑھتے ہیں", imageLetter: "س" },
        { word: "استاد", name: "استاد", hint: "جو ہمیں پڑھاتا ہے", imageLetter: "ع" },
        { word: "گاڑی", name: "گاڑی", hint: "جس پر ہم سفر کرتے ہیں", imageLetter: "گ" }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...wordsDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const correctWord = current.word;
        const wordLetters = correctWord.split('');
        const shuffledLetters = shuffleArray([...wordLetters]);
        
        // Get image for hint
        const imageUrl = getRandomImageForLetter(current.imageLetter);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🔄 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ بکھرے ہوئے حروف کو ترتیب دیں ✨</div>
                    ${imageUrl ? `<img src="${imageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 20px; margin: 0 auto 15px auto; border: 2px solid white;">` : ''}
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 15px; margin: 10px auto; display: inline-block;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">💡 اشارہ</div>
                        <div style="font-size: 1rem; color: #FCD34D;">${current.hint}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📝 بکھرے ہوئے حروف کو صحیح ترتیب میں لگائیں</h3>
                
                <!-- Mixed Letters Display (Drag Source) -->
                <div style="background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 10px;">📦 بکھرے ہوئے حروف (یہاں سے گھسیٹیں)</div>
                    <div id="mixedLettersSource" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; min-height: 80px;"></div>
                </div>
                
                <!-- Word Building Area (Drop Zone) -->
                <div style="background: #E0E7FF; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;">
                    <div style="font-size: 0.8rem; color: #2563EB; margin-bottom: 10px;">🎯 اپنا لفظ یہاں بنائیں</div>
                    <div id="wordDropZone" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; min-height: 80px;"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 10px;">
                    <button id="clearMixedBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <span>🗑️</span> صاف کریں
                    </button>
                    <button id="checkMixedBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <span>✅</span> چیک کریں
                    </button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevMixedBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextMixedBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate source letters (draggable)
        const sourceContainer = document.getElementById('mixedLettersSource');
        shuffledLetters.forEach(letter => {
            const div = document.createElement('div');
            div.textContent = letter;
            div.setAttribute('data-letter', letter);
            div.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; border-radius: 15px; cursor: grab; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.2s;';
            div.draggable = true;
            div.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', letter);
                e.dataTransfer.setData('sourceId', e.target.id || '');
            };
            div.ondragend = (e) => {
                if(e.dataTransfer.dropEffect === 'move') {
                    div.remove();
                }
            };
            div.onmouseenter = () => div.style.transform = 'scale(1.05)';
            div.onmouseleave = () => div.style.transform = 'scale(1)';
            sourceContainer.appendChild(div);
        });
        
        // Populate drop zones (empty slots for each letter)
        const dropZone = document.getElementById('wordDropZone');
        for(let i = 0; i < correctWord.length; i++) {
            const slot = document.createElement('div');
            slot.setAttribute('data-slot-index', i);
            slot.style.cssText = 'width: 70px; height: 70px; border: 2px dashed #2563EB; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; background: white; font-size: 2rem; color: #2563EB; transition: all 0.2s;';
            slot.ondragover = (e) => e.preventDefault();
            slot.ondrop = (e) => {
                e.preventDefault();
                const letter = e.dataTransfer.getData('text/plain');
                if(slot.textContent === '') {
                    slot.textContent = letter;
                    slot.style.background = '#D1FAE5';
                    slot.style.border = '2px solid #10B981';
                    
                    // Remove the dragged letter from source
                    const draggedElement = document.querySelector(`#mixedLettersSource div[data-letter="${letter}"]`);
                    if(draggedElement && draggedElement.parentNode) {
                        draggedElement.remove();
                    }
                }
            };
            dropZone.appendChild(slot);
        }
        
        // Clear button
        document.getElementById('clearMixedBtn').onclick = () => {
            // Clear all slots
            const slots = document.querySelectorAll('#wordDropZone div');
            slots.forEach(slot => {
                const letter = slot.textContent;
                slot.textContent = '';
                slot.style.background = 'white';
                slot.style.border = '2px dashed #2563EB';
                
                // Return letter to source if it was filled
                if(letter !== '') {
                    const sourceContainer = document.getElementById('mixedLettersSource');
                    const existingBtn = Array.from(sourceContainer.children).find(child => child.textContent === letter);
                    if(!existingBtn) {
                        const newBtn = document.createElement('div');
                        newBtn.textContent = letter;
                        newBtn.setAttribute('data-letter', letter);
                        newBtn.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; border-radius: 15px; cursor: grab; box-shadow: 0 4px 10px rgba(0,0,0,0.2);';
                        newBtn.draggable = true;
                        newBtn.ondragstart = (e) => e.dataTransfer.setData('text/plain', letter);
                        newBtn.onmouseenter = () => newBtn.style.transform = 'scale(1.05)';
                        newBtn.onmouseleave = () => newBtn.style.transform = 'scale(1)';
                        sourceContainer.appendChild(newBtn);
                    }
                }
            });
            showToast('صاف کر دیا گیا! دوبارہ کوشش کریں', 'info');
        };
        
        // Check button
        document.getElementById('checkMixedBtn').onclick = () => {
            let userWord = '';
            const slots = document.querySelectorAll('#wordDropZone div');
            slots.forEach(slot => {
                userWord += slot.textContent;
            });
            
            if(userWord === correctWord) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! "${correctWord}" لفظ درست ترتیب دیا! 🎉`, 'success');
                
                // Disable drag and drop
                document.querySelectorAll('#mixedLettersSource div').forEach(div => {
                    div.draggable = false;
                    div.style.opacity = '0.5';
                });
                document.querySelectorAll('#wordDropZone div').forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.color = 'white';
                    slot.style.border = '2px solid #10B981';
                });
                document.getElementById('clearMixedBtn').style.pointerEvents = 'none';
                document.getElementById('checkMixedBtn').style.pointerEvents = 'none';
                document.getElementById('clearMixedBtn').style.opacity = '0.5';
                document.getElementById('checkMixedBtn').style.opacity = '0.5';
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح ترتیب "${correctWord}" ہے۔ دوبارہ کوشش کریں`, 'error');
                
                // Red flash on slots
                const slots = document.querySelectorAll('#wordDropZone div');
                slots.forEach(slot => {
                    slot.style.background = '#FEE2E2';
                    slot.style.border = '2px solid #EF4444';
                    setTimeout(() => {
                        if(slot.textContent === '') {
                            slot.style.background = 'white';
                            slot.style.border = '2px dashed #2563EB';
                        } else {
                            slot.style.background = '#D1FAE5';
                            slot.style.border = '2px solid #10B981';
                        }
                    }, 500);
                });
            }
        };
        
        // Previous button
        document.getElementById('prevMixedBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextMixedBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب الفاظ درست ترتیب دیے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> الفاظ درست ترتیب دیے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod5Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod5Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🔄'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 15: METHOD 6 - ملتے جلتے حروف
// ========================================== */
// ========================================== */
// SECTION 15: METHOD 6 - ملتے جلتے حروف میں فرق
// (Similar Letters Difference - س، ش، ز، ذ، وغیرہ)
// تصویر دیکھیں | بتائیں کہ یہ کون سا حرف ہے
// 10-15 Random Questions | No Repeat
// ========================================== */

function method6_SimilarLetters() {
    // ==========================================
    // SIMILAR LETTERS DATABASE with their images
    // Each pair of similar letters with example words
    // ==========================================
    
    const similarLettersDatabase = [
        // س vs ش
        { 
            letter: "س", 
            similarTo: "ش", 
            name: "سین", 
            exampleWord: "سکول", 
            hint: "یہ حرف 'س' ہے - اس کی آواز 'س' جیسی ہے",
            imageLetter: "س",
            distinguishingFeature: "س میں تین دانت، ش میں چار دانت"
        },
        { 
            letter: "ش", 
            similarTo: "س", 
            name: "شین", 
            exampleWord: "شیر", 
            hint: "یہ حرف 'ش' ہے - اس کی آواز 'ش' جیسی ہے",
            imageLetter: "ش",
            distinguishingFeature: "ش میں چار دانت، س میں تین دانت"
        },
        
        // ز vs ذ
        { 
            letter: "ز", 
            similarTo: "ذ", 
            name: "زے", 
            exampleWord: "زمین", 
            hint: "یہ حرف 'ز' ہے - اس کی آواز 'ز' جیسی ہے",
            imageLetter: "ز",
            distinguishingFeature: "ز میں نقطہ اوپر، ذ میں نقطہ اوپر لیکن مختلف"
        },
        { 
            letter: "ذ", 
            similarTo: "ز", 
            name: "ذال", 
            exampleWord: "ذہین", 
            hint: "یہ حرف 'ذ' ہے - اس کی آواز 'ذ' جیسی ہے",
            imageLetter: "ذ",
            distinguishingFeature: "ذ میں نقطہ اوپر، ز میں بھی نقطہ اوپر"
        },
        
        // ص vs ض
        { 
            letter: "ص", 
            similarTo: "ض", 
            name: "صاد", 
            exampleWord: "صابن", 
            hint: "یہ حرف 'ص' ہے - اس کی آواز 'ص' جیسی ہے",
            imageLetter: "ص",
            distinguishingFeature: "ص میں نقطہ نہیں، ض میں نقطہ ہے"
        },
        { 
            letter: "ض", 
            similarTo: "ص", 
            name: "ضاد", 
            exampleWord: "ضدی", 
            hint: "یہ حرف 'ض' ہے - اس کی آواز 'ض' جیسی ہے",
            imageLetter: "ض",
            distinguishingFeature: "ض میں نقطہ ہے، ص میں نقطہ نہیں"
        },
        
        // ط vs ظ
        { 
            letter: "ط", 
            similarTo: "ظ", 
            name: "طوئے", 
            exampleWord: "طوطا", 
            hint: "یہ حرف 'ط' ہے - اس کی آواز 'ط' جیسی ہے",
            imageLetter: "ط",
            distinguishingFeature: "ط میں نقطہ نہیں، ظ میں نقطہ ہے"
        },
        { 
            letter: "ظ", 
            similarTo: "ط", 
            name: "ظوئے", 
            exampleWord: "ظریف", 
            hint: "یہ حرف 'ظ' ہے - اس کی آواز 'ظ' جیسی ہے",
            imageLetter: "ظ",
            distinguishingFeature: "ظ میں نقطہ ہے، ط میں نقطہ نہیں"
        },
        
        // ع vs غ
        { 
            letter: "ع", 
            similarTo: "غ", 
            name: "عین", 
            exampleWord: "عورت", 
            hint: "یہ حرف 'ع' ہے - اس کی آواز 'ع' جیسی ہے",
            imageLetter: "ع",
            distinguishingFeature: "ع میں نقطہ نہیں، غ میں نقطہ ہے"
        },
        { 
            letter: "غ", 
            similarTo: "ع", 
            name: "غین", 
            exampleWord: "غصہ", 
            hint: "یہ حرف 'غ' ہے - اس کی آواز 'غ' جیسی ہے",
            imageLetter: "غ",
            distinguishingFeature: "غ میں نقطہ ہے، ع میں نقطہ نہیں"
        },
        
        // ک vs گ
        { 
            letter: "ک", 
            similarTo: "گ", 
            name: "کاف", 
            exampleWord: "کتاب", 
            hint: "یہ حرف 'ک' ہے - اس کی آواز 'ک' جیسی ہے",
            imageLetter: "ک",
            distinguishingFeature: "ک میں دو خط، گ میں تین خط"
        },
        { 
            letter: "گ", 
            similarTo: "ک", 
            name: "گاف", 
            exampleWord: "گھر", 
            hint: "یہ حرف 'گ' ہے - اس کی آواز 'گ' جیسی ہے",
            imageLetter: "گ",
            distinguishingFeature: "گ میں تین خط، ک میں دو خط"
        },
        
        // چ vs ج
        { 
            letter: "چ", 
            similarTo: "ج", 
            name: "چے", 
            exampleWord: "چائے", 
            hint: "یہ حرف 'چ' ہے - اس کی آواز 'چ' جیسی ہے",
            imageLetter: "چ",
            distinguishingFeature: "چ میں تین نقطے، ج میں ایک نقطہ"
        },
        { 
            letter: "ج", 
            similarTo: "چ", 
            name: "جیم", 
            exampleWord: "جوتا", 
            hint: "یہ حرف 'ج' ہے - اس کی آواز 'ج' جیسی ہے",
            imageLetter: "ج",
            distinguishingFeature: "ج میں ایک نقطہ، چ میں تین نقطے"
        },
        
        // ح vs خ
        { 
            letter: "ح", 
            similarTo: "خ", 
            name: "حے", 
            exampleWord: "حلوہ", 
            hint: "یہ حرف 'ح' ہے - اس کی آواز 'ح' جیسی ہے",
            imageLetter: "ح",
            distinguishingFeature: "ح میں نقطہ نہیں، خ میں نقطہ ہے"
        },
        { 
            letter: "خ", 
            similarTo: "ح", 
            name: "خے", 
            exampleWord: "خوبانی", 
            hint: "یہ حرف 'خ' ہے - اس کی آواز 'خ' جیسی ہے",
            imageLetter: "خ",
            distinguishingFeature: "خ میں نقطہ ہے، ح میں نقطہ نہیں"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...similarLettersDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctLetter, similarLetter) {
        let options = [correctLetter, similarLetter];
        
        // Add 2 more random similar letters
        const otherLetters = ['س', 'ش', 'ز', 'ذ', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ک', 'گ', 'چ', 'ج', 'ح', 'خ'];
        while(options.length < 4) {
            const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
            if(!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = getRandomImageForLetter(current.imageLetter);
        const options = generateOptions(current.letter, current.similarTo);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">⚖️ سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ ملتے جلتے حروف میں فرق پہچانیں ✨</div>
                    
                    <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin: 20px 0;">
                        <div style="text-align: center;">
                            ${imageUrl ? `<img src="${imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 20px; border: 3px solid white; margin-bottom: 10px;">` : ''}
                            <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 8px 15px; display: inline-block;">
                                <div style="font-size: 0.7rem; color: #93C5FD;">مثال لفظ</div>
                                <div style="font-size: 1.2rem; color: #FCD34D;">${current.exampleWord}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 15px; margin: 15px auto; max-width: 300px;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">💡 پہچان کا طریقہ</div>
                        <div style="font-size: 0.9rem; color: #FCD34D;">${current.distinguishingFeature}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">❓ یہ تصویر کس حرف کی ہے؟</h3>
                
                <div id="similarLetterOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 400px; margin: 20px auto;"></div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevSimilarBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextSimilarBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('similarLetterOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 3rem;">${opt}</div><div style="font-size: 0.7rem; margin-top: 5px;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer; transition: all 0.2s; text-align: center;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === current.letter) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${current.name}" حرف درست پہچانا! 🎉`, 'success');
                    
                    document.querySelectorAll('#similarLetterOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    let correctAnswer = current.letter;
                    let correctName = current.name;
                    showToast(`❌ غلط! صحیح حرف "${correctAnswer}" (${correctName}) ہے۔ دوبارہ دیکھیں!`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevSimilarBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextSimilarBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب ملتے جلتے حروف درست پہچانے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> ملتے جلتے حروف درست پہچانے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod6Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod6Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','⚖️'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 16: METHOD 7 - فلیش کارڈز
// ========================================== */
// ========================================== */
// SECTION 16: METHOD 7 - فلیش کارڈز
// (Flashcards - Picture Recognition)
// تصویر دیکھیں | بتائیں کہ یہ کیا ہے؟
// 15-20 Random Questions | No Repeat
// ========================================== */

function method7_Flashcards() {
    // ==========================================
    // FLASHCARDS DATABASE with images and names
    // Each flashcard has an image and correct name
    // ==========================================
    
    const flashcardsDatabase = [
        // Animals (جانور)
        { id: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX", name: "بیل", hint: "ہل چلانے والا جانور", category: "جانور" },
        { id: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-", name: "بکری", hint: "دودھ دینے والی", category: "جانور" },
        { id: "1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m", name: "بطخ", hint: "پانی کا پرندہ", category: "پرندہ" },
        { id: "1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK", name: "بندر", hint: "درختوں پر رہنے والا", category: "جانور" },
        { id: "195uQPWZsukNoAkVDipAdzStzStdOeAWH", name: "بلی", hint: "میاؤں میاؤں", category: "جانور" },
        { id: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz", name: "اونٹ", hint: "صحرا کا جانور", category: "جانور" },
        { id: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk", name: "ہاتھی", hint: "بہت بڑا جانور", category: "جانور" },
        
        // Fruits (پھل)
        { id: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk", name: "انار", hint: "سرخ رنگ کا پھل", category: "پھل" },
        { id: "1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_", name: "انجیر", hint: "میٹھا پھل", category: "پھل" },
        { id: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6", name: "انگور", hint: "چھوٹے میٹھے پھل", category: "پھل" },
        { id: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF", name: "آم", hint: "بادشاہ پھل", category: "پھل" },
        { id: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO", name: "تربوز", hint: "بڑا میٹھا پھل", category: "پھل" },
        
        // Vegetables (سبزیاں)
        { id: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd", name: "آلو", hint: "سبزی", category: "سبزی" },
        { id: "1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE", name: "آڑو", hint: "رس دار پھل", category: "پھل" },
        { id: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg", name: "پیاز", hint: "آنکھ میں آنسو لائے", category: "سبزی" },
        { id: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c", name: "ٹماٹر", hint: "سرخ سبزی", category: "سبزی" },
        
        // Objects (اشیاء)
        { id: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh", name: "کتاب", hint: "جس میں ہم پڑھتے ہیں", category: "چیز" },
        { id: "1dncMYa-Ox8T0Gk7tNfzgbMtLjBjbkucp", name: "قلم", hint: "جس سے ہم لکھتے ہیں", category: "چیز" },
        { id: "1KIQ55LEmJ1qina2KytzenKT6p2_yhxEr", name: "کرسی", hint: "جس پر بیٹھتے ہیں", category: "چیز" },
        { id: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc", name: "پودا", hint: "چھوٹا درخت", category: "پودا" },
        { id: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz", name: "پنکھا", hint: "ہوا کرنے والا", category: "چیز" },
        { id: "100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd", name: "پنسل", hint: "لکھنے والی چیز", category: "چیز" },
        { id: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq", name: "ٹوپی", hint: "سر پر پہنتے ہیں", category: "چیز" },
        { id: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa", name: "جوتا", hint: "پاؤں میں پہنتے ہیں", category: "چیز" },
        
        // Birds (پرندے)
        { id: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x", name: "بلبل", hint: "میٹھا گانے والا پرندہ", category: "پرندہ" },
        { id: "17DGLNryxH1EN6dVANlrN20yWQK2i0-Mw", name: "تتلی", hint: "رنگ برنگا کیڑا", category: "کیڑا" },
        { id: "1iGPRmcpngUQoh4xh0IN3tG4TAsY1Hmpb", name: "چڑیا", hint: "چہچہانے والا پرندہ", category: "پرندہ" }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const shuffled = shuffleArray([...flashcardsDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctName) {
        const allNames = flashcardsDatabase.map(f => f.name);
        let options = [correctName];
        
        while(options.length < 4) {
            const randomName = allNames[Math.floor(Math.random() * allNames.length)];
            if(!options.includes(randomName) && randomName !== correctName) {
                options.push(randomName);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.id}&sz=w400`;
        const options = generateOptions(current.name);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🃏 فلیش کارڈ ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 30px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">
                        📇 ${current.category} | 💡 ${current.hint}
                    </div>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 25px; padding: 20px; margin: 10px auto; max-width: 250px;">
                        <img src="${imageUrl}" style="width: 180px; height: 180px; object-fit: cover; border-radius: 20px; border: 3px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"
                             onerror="this.src='https://via.placeholder.com/180x180/2563EB/white?text=${current.name}'">
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">❓ یہ تصویر کس چیز کی ہے؟</h3>
                
                <div id="flashcardOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 500px; margin: 20px auto;"></div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevFlashBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <span>◀</span> پچھلا
                    </button>
                    <button id="nextFlashBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        اگلا <span>▶</span>
                    </button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('flashcardOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 15px 10px; cursor: pointer; transition: all 0.2s; font-size: 1.1rem; font-family: inherit;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === current.name) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! یہ "${current.name}" ہے! 🎉`, 'success');
                    
                    document.querySelectorAll('#flashcardOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! صحیح جواب "${current.name}" ہے۔ دوبارہ دیکھیں!`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevFlashBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا فلیش کارڈ ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextFlashBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے فلیش کارڈ پر جائیں', 'info');
            } else {
                showToast('یہ آخری فلیش کارڈ ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب تصاویر درست پہچانیں! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> تصاویر درست پہچانیں</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod7Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod7Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🃏'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 17: METHOD 8 - خالی جگہ پر کریں
// ========================================== */
// ========================================== */
// SECTION 17: METHOD 8 - خالی جگہ پر کریں
// (Fill in the Blank - Missing Letter)
// لفظ میں غائب حرف تلاش کریں
// 10-15 Random Questions | No Repeat
// ========================================== */

// ========================================== */
// SECTION 17: METHOD 8 - خالی جگہ پر کریں
// (Fill in the Blank - Missing Letter)
// لفظ میں غائب حرف تلاش کریں
// 10-15 Random Questions | No Repeat
// ========================================== */

function method8_FillBlank() {
    // ==========================================
    // CORRECTED DATABASE - Image and Word Match
    // Each word has a matching image from Google Drive
    // ==========================================
    
    const fillBlankDatabase = [
        // Animals (جانور) - with correct matching images
        { 
            word: "بکری", 
            fullWord: "بکری", 
            missingLetter: "ک", 
            position: 1, 
            displayWord: "ب_ری", 
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            imageLetter: "ب",
            hint: "دودھ دینے والی جانور",
            category: "جانور"
        },
        { 
            word: "بلی", 
            fullWord: "بلی", 
            missingLetter: "ل", 
            position: 1, 
            displayWord: "ب_ی", 
            imageId: "195uQPWZsukNoAkVDipAdzStzStdOeAWH",
            imageLetter: "ب",
            hint: "میاؤں میاؤں کرنے والی",
            category: "جانور"
        },
        { 
            word: "بیل", 
            fullWord: "بیل", 
            missingLetter: "ل", 
            position: 2, 
            displayWord: "بی_", 
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            imageLetter: "ب",
            hint: "ہل چلانے والا جانور",
            category: "جانور"
        },
        { 
            word: "اونٹ", 
            fullWord: "اونٹ", 
            missingLetter: "ن", 
            position: 1, 
            displayWord: "ا_ٹ", 
            imageId: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz",
            imageLetter: "ا",
            hint: "صحرا کا جانور",
            category: "جانور"
        },
        
        // Fruits (پھل) - with correct matching images
        { 
            word: "انار", 
            fullWord: "انار", 
            missingLetter: "ن", 
            position: 1, 
            displayWord: "ا_ار", 
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            imageLetter: "ا",
            hint: "سرخ رنگ کا پھل",
            category: "پھل"
        },
        { 
            word: "آم", 
            fullWord: "آم", 
            missingLetter: "م", 
            position: 1, 
            displayWord: "آ_", 
            imageId: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF",
            imageLetter: "آ",
            hint: "بادشاہ پھل",
            category: "پھل"
        },
        { 
            word: "انگور", 
            fullWord: "انگور", 
            missingLetter: "گ", 
            position: 2, 
            displayWord: "ان_ور", 
            imageId: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6",
            imageLetter: "ا",
            hint: "چھوٹے میٹھے پھل",
            category: "پھل"
        },
        { 
            word: "تربوز", 
            fullWord: "تربوز", 
            missingLetter: "ب", 
            position: 2, 
            displayWord: "تر_وز", 
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            imageLetter: "ت",
            hint: "بڑا میٹھا پھل",
            category: "پھل"
        },
        
        // Vegetables (سبزیاں) - with correct matching images
        { 
            word: "آلو", 
            fullWord: "آلو", 
            missingLetter: "ل", 
            position: 1, 
            displayWord: "آ_و", 
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            imageLetter: "آ",
            hint: "سبزی جو آلو ٹکا میں استعمال ہوتی ہے",
            category: "سبزی"
        },
        { 
            word: "پیاز", 
            fullWord: "پیاز", 
            missingLetter: "ز", 
            position: 2, 
            displayWord: "پیا_", 
            imageId: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg",
            imageLetter: "پ",
            hint: "آنکھ میں آنسو لانے والی سبزی",
            category: "سبزی"
        },
        { 
            word: "ٹماٹر", 
            fullWord: "ٹماٹر", 
            missingLetter: "ٹ", 
            position: 0, 
            displayWord: "_ماٹر", 
            imageId: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            imageLetter: "ٹ",
            hint: "سرخ رنگ کی سبزی",
            category: "سبزی"
        },
        
        // Objects (اشیاء) - with correct matching images
        { 
            word: "کتاب", 
            fullWord: "کتاب", 
            missingLetter: "ت", 
            position: 1, 
            displayWord: "ک_اب", 
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            imageLetter: "ک",
            hint: "جس میں ہم پڑھتے ہیں",
            category: "چیز"
        },
        { 
            word: "قلم", 
            fullWord: "قلم", 
            missingLetter: "ل", 
            position: 1, 
            displayWord: "ق_م", 
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            imageLetter: "ق",
            hint: "جس سے ہم لکھتے ہیں",
            category: "چیز"
        },
        { 
            word: "کرسی", 
            fullWord: "کرسی", 
            missingLetter: "س", 
            position: 3, 
            displayWord: "کر_ی", 
            imageId: "1KIQ55LEmJ1qina2KytzenKT6p2_yhxEr",
            imageLetter: "ک",
            hint: "جس پر بیٹھتے ہیں",
            category: "چیز"
        },
        { 
            word: "پنکھا", 
            fullWord: "پنکھا", 
            missingLetter: "ن", 
            position: 1, 
            displayWord: "پ_کھا", 
            imageId: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz",
            imageLetter: "پ",
            hint: "ہوا کرنے والا",
            category: "چیز"
        },
        { 
            word: "پنسل", 
            fullWord: "پنسل", 
            missingLetter: "س", 
            position: 2, 
            displayWord: "پن_ل", 
            imageId: "100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd",
            imageLetter: "پ",
            hint: "لکھنے والی چیز",
            category: "چیز"
        },
        { 
            word: "ٹوپی", 
            fullWord: "ٹوپی", 
            missingLetter: "پ", 
            position: 2, 
            displayWord: "ٹو_ی", 
            imageId: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq",
            imageLetter: "ٹ",
            hint: "سر پر پہنتے ہیں",
            category: "چیز"
        },
        { 
            word: "جوتا", 
            fullWord: "جوتا", 
            missingLetter: "ت", 
            position: 2, 
            displayWord: "جو_ا", 
            imageId: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa",
            imageLetter: "ج",
            hint: "پاؤں میں پہنتے ہیں",
            category: "چیز"
        },
        
        // Birds (پرندے)
        { 
            word: "توتا", 
            fullWord: "توتا", 
            missingLetter: "ت", 
            position: 0, 
            displayWord: "_وتا", 
            imageId: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            imageLetter: "ت",
            hint: "سبز رنگ کا پرندہ",
            category: "پرندہ"
        },
        { 
            word: "بلبل", 
            fullWord: "بلبل", 
            missingLetter: "ل", 
            position: 1, 
            displayWord: "ب_بل", 
            imageId: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x",
            imageLetter: "ب",
            hint: "میٹھا گانے والا پرندہ",
            category: "پرندہ"
        },
        
        // Other common words
        { 
            word: "پانی", 
            fullWord: "پانی", 
            missingLetter: "ن", 
            position: 2, 
            displayWord: "پا_ی", 
            imageId: "14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-",
            imageLetter: "پ",
            hint: "جو ہم پیتے ہیں",
            category: "پینے کی چیز"
        },
        { 
            word: "دودھ", 
            fullWord: "دودھ", 
            missingLetter: "د", 
            position: 0, 
            displayWord: "_ودھ", 
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            imageLetter: "د",
            hint: "سفید رنگ کا مشروب",
            category: "پینے کی چیز"
        },
        { 
            word: "روٹی", 
            fullWord: "روٹی", 
            missingLetter: "ٹ", 
            position: 1, 
            displayWord: "رو_ی", 
            imageId: "1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1",
            imageLetter: "ر",
            hint: "جو ہم کھاتے ہیں",
            category: "کھانے کی چیز"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...fillBlankDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctLetter) {
        const allLetters = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی', 'ے'];
        let options = [correctLetter];
        
        while(options.length < 4) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(!options.includes(randomLetter) && randomLetter !== correctLetter) {
                options.push(randomLetter);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w400`;
        const options = generateOptions(current.missingLetter);
        
        // Display word with highlighted missing position
        const displayWithHighlight = current.displayWord.replace('_', '<span style="color:#EF4444; font-size:2rem; font-weight:bold; background:#FEE2E2; padding:0 15px; border-radius:10px; margin:0 5px;">?</span>');
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">❓ سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.8rem; color: #93C5FD; margin-bottom: 5px;">📁 ${current.category}</div>
                    <img src="${imageUrl}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 20px; margin: 10px auto; border: 3px solid white; box-shadow: 0 5px 20px rgba(0,0,0,0.2);"
                         onerror="this.src='https://via.placeholder.com/140x140/2563EB/white?text=${current.fullWord}'">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 10px 15px; margin: 15px auto; display: inline-block;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">💡 اشارہ</div>
                        <div style="font-size: 0.9rem; color: #FCD34D;">${current.hint}</div>
                    </div>
                </div>
                
                <div style="background: #F3F4F6; border-radius: 25px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.9rem; color: #6B7280; margin-bottom: 10px;">📝 لفظ مکمل کریں:</div>
                    <div style="font-size: 2rem; font-weight: bold; color: #1F2937; letter-spacing: 3px; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 5px;">
                        ${displayWithHighlight}
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">❓ غائب حرف کون سا ہے؟</h3>
                
                <div id="fillBlankOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 400px; margin: 20px auto;"></div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevFillBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextFillBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('fillBlankOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2rem;">${opt}</div><div style="font-size: 0.7rem;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 15px 10px; cursor: pointer; transition: all 0.2s; text-align: center;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === current.missingLetter) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! غائب حرف "${opt}" صحیح ہے! 🎉`, 'success');
                    
                    document.querySelectorAll('#fillBlankOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    // Show the complete word
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! صحیح حرف "${current.missingLetter}" ہے۔ دوبارہ کوشش کریں!`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevFillBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextFillBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب غائب حروف درست پہچانے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> غائب حروف درست پہچانے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod8Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod8Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','❓'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}// ========================================== */
// SECTION 18: METHOD 9 - دو حرفی الفاظ
// ========================================== */
// ========================================== */
// SECTION 18: METHOD 9 - دو حرفی الفاظ
// (Two Letter Words)
// دو حروف سے لفظ بنانا سیکھیں
// 15-20 Random Questions | No Repeat
// ========================================== */

function method9_TwoLetter() {
    // ==========================================
    // TWO LETTER WORDS DATABASE with images
    // Each word has 2 letters with matching image
    // ==========================================
    
    const twoLetterWords = [
        // Basic two-letter words
        { 
            word: "با", 
            letters: ["ب", "ا"], 
            meaning: "with / کے ساتھ",
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            imageLetter: "ب",
            hint: "لفظ 'با' کا مطلب ہے 'کے ساتھ'",
            example: "با ادب"
        },
        { 
            word: "تا", 
            letters: ["ت", "ا"], 
            meaning: "until / تک",
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            imageLetter: "ت",
            hint: "لفظ 'تا' کا مطلب ہے 'تک'",
            example: "صبح تا شام"
        },
        { 
            word: "پا", 
            letters: ["پ", "ا"], 
            meaning: "foot / پاؤں",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            imageLetter: "پ",
            hint: "لفظ 'پا' کا مطلب ہے 'پاؤں'",
            example: "پا برہنہ"
        },
        { 
            word: "ما", 
            letters: ["م", "ا"], 
            meaning: "we / ہم",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            imageLetter: "م",
            hint: "لفظ 'ما' کا مطلب ہے 'ہم'",
            example: "ما سب"
        },
        { 
            word: "نا", 
            letters: ["ن", "ا"], 
            meaning: "no / نہیں",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            imageLetter: "ن",
            hint: "لفظ 'نا' کا مطلب ہے 'نہیں'",
            example: "نا ممکن"
        },
        { 
            word: "لا", 
            letters: ["ل", "ا"], 
            meaning: "no / نہیں (انکار)",
            imageId: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            imageLetter: "ل",
            hint: "لفظ 'لا' کا مطلب ہے 'نہیں'",
            example: "لا علاج"
        },
        { 
            word: "یا", 
            letters: ["ی", "ا"], 
            meaning: "or / یا",
            imageId: "1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_",
            imageLetter: "ی",
            hint: "لفظ 'یا' کا مطلب ہے 'یا' (choice)",
            example: "یہ یا وہ"
        },
        { 
            word: "را", 
            letters: ["ر", "ا"], 
            meaning: "to / کی طرف",
            imageId: "1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF",
            imageLetter: "ر",
            hint: "لفظ 'را' کا مطلب ہے 'کی طرف'",
            example: "سو فیصد"
        },
        { 
            word: "دہ", 
            letters: ["د", "ہ"], 
            meaning: "ten / دس",
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            imageLetter: "د",
            hint: "لفظ 'دہ' کا مطلب ہے 'دس'",
            example: "دہ سال"
        },
        { 
            word: "بہ", 
            letters: ["ب", "ہ"], 
            meaning: "to / میں (لگنے والا)",
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            imageLetter: "ب",
            hint: "لفظ 'بہ' کا مطلب ہے 'میں' (لگنے والا)",
            example: "بہت"
        },
        { 
            word: "سے", 
            letters: ["س", "ے"], 
            meaning: "from / سے",
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            imageLetter: "س",
            hint: "لفظ 'سے' کا مطلب ہے 'سے'",
            example: "گھر سے"
        },
        { 
            word: "کا", 
            letters: ["ک", "ا"], 
            meaning: "of / کا",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            imageLetter: "ک",
            hint: "لفظ 'کا' کا مطلب ہے 'کا' (ملکیت)",
            example: "کتاب کا"
        },
        { 
            word: "کی", 
            letters: ["ک", "ی"], 
            meaning: "of (feminine) / کی",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            imageLetter: "ک",
            hint: "لفظ 'کی' کا مطلب ہے 'کی' (ملکیت مونث)",
            example: "گاڑی کی"
        },
        { 
            word: "میں", 
            letters: ["م", "ی", "ں"], 
            meaning: "in / میں",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            imageLetter: "م",
            hint: "لفظ 'میں' کا مطلب ہے 'میں'",
            example: "گھر میں"
        },
        { 
            word: "پر", 
            letters: ["پ", "ر"], 
            meaning: "on / پر",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            imageLetter: "پ",
            hint: "لفظ 'پر' کا مطلب ہے 'پر'",
            example: "میز پر"
        },
        { 
            word: "نہ", 
            letters: ["ن", "ہ"], 
            meaning: "no / نہیں",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            imageLetter: "ن",
            hint: "لفظ 'نہ' کا مطلب ہے 'نہیں'",
            example: "نہ کرو"
        },
        { 
            word: "تو", 
            letters: ["ت", "و"], 
            meaning: "then / تو",
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            imageLetter: "ت",
            hint: "لفظ 'تو' کا مطلب ہے 'تو'",
            example: "اگر تو"
        },
        { 
            word: "ہی", 
            letters: ["ہ", "ی"], 
            meaning: "only / ہی",
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            imageLetter: "ہ",
            hint: "لفظ 'ہی' کا مطلب ہے 'ہی' (تاکید)",
            example: "وہی"
        },
        { 
            word: "بھی", 
            letters: ["ب", "ھ", "ی"], 
            meaning: "also / بھی",
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            imageLetter: "ب",
            hint: "لفظ 'بھی' کا مطلب ہے 'بھی'",
            example: "میں بھی"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const shuffled = shuffleArray([...twoLetterWords]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w400`;
        const wordLetters = current.word.split('');
        const letterPool = shuffleArray([...wordLetters]);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🔡 دو حرفی لفظ - سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ دو حروف ملا کر لفظ بنائیں ✨</div>
                    <img src="${imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 20px; margin: 10px auto; border: 3px solid white;"
                         onerror="this.src='https://via.placeholder.com/120x120/2563EB/white?text=${current.word}'">
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 12px; margin: 15px auto; max-width: 250px;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">💡 معنی</div>
                        <div style="font-size: 1rem; color: #FCD34D;">${current.meaning}</div>
                        <div style="font-size: 0.8rem; color: #93C5FD; margin-top: 5px;">مثال: ${current.example}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📝 نیچے سے حروف چن کر لفظ بنائیں: <span style="color:#F59E0B;">"${current.word}"</span></h3>
                
                <!-- Letter Pool -->
                <div id="letterPoolTwo" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin: 20px 0;"></div>
                
                <!-- Word Building Area -->
                <div id="wordBuildTwo" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; min-height: 80px; background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;"></div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearTwoBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkTwoBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevTwoBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextTwoBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate letter pool
        const letterPoolDiv = document.getElementById('letterPoolTwo');
        letterPool.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.style.cssText = 'width: 80px; height: 80px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 20px; font-size: 2rem; cursor: pointer; transition: all 0.2s;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                // Find first empty slot
                const slots = document.querySelectorAll('#wordBuildTwo .word-slot');
                for(let i = 0; i < slots.length; i++) {
                    if(slots[i].textContent === '') {
                        slots[i].textContent = letter;
                        slots[i].style.background = '#D1FAE5';
                        slots[i].style.border = '2px solid #10B981';
                        btn.style.opacity = '0.5';
                        btn.style.pointerEvents = 'none';
                        break;
                    }
                }
            };
            letterPoolDiv.appendChild(btn);
        });
        
        // Create word building slots
        const wordBuildDiv = document.getElementById('wordBuildTwo');
        for(let i = 0; i < wordLetters.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'word-slot';
            slot.style.cssText = 'width: 80px; height: 80px; background: white; border: 2px solid #2563EB; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; color: #2563EB; transition: all 0.2s;';
            slot.textContent = '';
            wordBuildDiv.appendChild(slot);
        }
        
        // Clear button
        document.getElementById('clearTwoBtn').onclick = () => {
            const slots = document.querySelectorAll('#wordBuildTwo .word-slot');
            slots.forEach(slot => {
                slot.textContent = '';
                slot.style.background = 'white';
                slot.style.border = '2px solid #2563EB';
            });
            document.querySelectorAll('#letterPoolTwo button').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            showToast('صاف کر دیا گیا!', 'info');
        };
        
        // Check button
        document.getElementById('checkTwoBtn').onclick = () => {
            let userWord = '';
            const slots = document.querySelectorAll('#wordBuildTwo .word-slot');
            slots.forEach(slot => {
                userWord += slot.textContent;
            });
            
            if(userWord === current.word) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! "${current.word}" لفظ درست بنایا! 🎉`, 'success');
                
                document.querySelectorAll('#letterPoolTwo button').forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                });
                slots.forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.color = 'white';
                });
                document.getElementById('clearTwoBtn').style.pointerEvents = 'none';
                document.getElementById('checkTwoBtn').style.pointerEvents = 'none';
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح لفظ "${current.word}" ہے۔ دوبارہ کوشش کریں!`, 'error');
                
                slots.forEach(slot => {
                    slot.style.background = '#FEE2E2';
                    slot.style.border = '2px solid #EF4444';
                    setTimeout(() => {
                        if(slot.textContent === '') {
                            slot.style.background = 'white';
                            slot.style.border = '2px solid #2563EB';
                        } else {
                            slot.style.background = '#D1FAE5';
                            slot.style.border = '2px solid #10B981';
                        }
                    }, 500);
                });
            }
        };
        
        // Previous button
        document.getElementById('prevTwoBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextTwoBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب دو حرفی الفاظ درست بنائے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> دو حرفی الفاظ درست بنائے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod9Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod9Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🔡'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 19: METHOD 10 - تین حرفی الفاظ
// ========================================== */
// ========================================== */
// SECTION 19: METHOD 10 - تین حرفی الفاظ
// (Three Letter Words)
// تین حروف سے لفظ بنانا سیکھیں
// 15-20 Random Questions | No Repeat
// ========================================== */

function method10_ThreeLetter() {
    // ==========================================
    // THREE LETTER WORDS DATABASE with images
    // Each word has 3 letters with matching image
    // ==========================================
    
    const threeLetterWords = [
        // Animals (جانور)
        { 
            word: "بلی", 
            letters: ["ب", "ل", "ی"], 
            meaning: "Cat",
            imageId: "195uQPWZsukNoAkVDipAdzStzStdOeAWH",
            imageLetter: "ب",
            hint: "میاؤں میاؤں کرنے والی",
            category: "جانور"
        },
        { 
            word: "بکر", 
            letters: ["ب", "ک", "ر"], 
            meaning: "Goat (male)",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            imageLetter: "ب",
            hint: "دودھ دینے والا جانور",
            category: "جانور"
        },
        { 
            word: "گھر", 
            letters: ["گ", "ھ", "ر"], 
            meaning: "House",
            imageId: "1_9B6U9qjHxttAVZvQ9ISRgvAz76duonO",
            imageLetter: "گ",
            hint: "جہاں ہم رہتے ہیں",
            category: "چیز"
        },
        { 
            word: "شیر", 
            letters: ["ش", "ی", "ر"], 
            meaning: "Lion",
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            imageLetter: "ش",
            hint: "جنگل کا بادشاہ",
            category: "جانور"
        },
        { 
            word: "توت", 
            letters: ["ت", "و", "ت"], 
            meaning: "Parrot",
            imageId: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            imageLetter: "ت",
            hint: "سبز رنگ کا پرندہ",
            category: "پرندہ"
        },
        
        // Fruits (پھل)
        { 
            word: "انار", 
            letters: ["ا", "ن", "ا", "ر"], 
            meaning: "Pomegranate",
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            imageLetter: "ا",
            hint: "سرخ رنگ کا پھل",
            category: "پھل"
        },
        { 
            word: "آلو", 
            letters: ["آ", "ل", "و"], 
            meaning: "Potato",
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            imageLetter: "آ",
            hint: "سبزی جو آلو ٹکا میں استعمال ہوتی ہے",
            category: "سبزی"
        },
        { 
            word: "پیاز", 
            letters: ["پ", "ی", "ا", "ز"], 
            meaning: "Onion",
            imageId: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg",
            imageLetter: "پ",
            hint: "آنکھ میں آنسو لانے والی سبزی",
            category: "سبزی"
        },
        
        // Objects (اشیاء)
        { 
            word: "کتاب", 
            letters: ["ک", "ت", "ا", "ب"], 
            meaning: "Book",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            imageLetter: "ک",
            hint: "جس میں ہم پڑھتے ہیں",
            category: "چیز"
        },
        { 
            word: "قلم", 
            letters: ["ق", "ل", "م"], 
            meaning: "Pen",
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            imageLetter: "ق",
            hint: "جس سے ہم لکھتے ہیں",
            category: "چیز"
        },
        { 
            word: "میز", 
            letters: ["م", "ی", "ز"], 
            meaning: "Table",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            imageLetter: "م",
            hint: "جس پر ہم کھانا کھاتے ہیں",
            category: "چیز"
        },
        { 
            word: "باغ", 
            letters: ["ب", "ا", "غ"], 
            meaning: "Garden",
            imageId: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x",
            imageLetter: "ب",
            hint: "جہاں پھول اور درخت ہوں",
            category: "چیز"
        },
        { 
            word: "پھول", 
            letters: ["پ", "ھ", "و", "ل"], 
            meaning: "Flower",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            imageLetter: "پ",
            hint: "جو باغ میں کھلتا ہے",
            category: "پھول"
        },
        { 
            word: "پانی", 
            letters: ["پ", "ا", "ن", "ی"], 
            meaning: "Water",
            imageId: "14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-",
            imageLetter: "پ",
            hint: "جو ہم پیتے ہیں",
            category: "مشروب"
        },
        { 
            word: "دودھ", 
            letters: ["د", "و", "د", "ھ"], 
            meaning: "Milk",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            imageLetter: "د",
            hint: "سفید رنگ کا مشروب",
            category: "مشروب"
        },
        { 
            word: "روٹی", 
            letters: ["ر", "و", "ٹ", "ی"], 
            meaning: "Bread",
            imageId: "1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1",
            imageLetter: "ر",
            hint: "جو ہم کھاتے ہیں",
            category: "خوراک"
        },
        
        // Colors (رنگ)
        { 
            word: "نیلا", 
            letters: ["ن", "ی", "ل", "ا"], 
            meaning: "Blue",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            imageLetter: "ن",
            hint: "آسمان کا رنگ",
            category: "رنگ"
        },
        { 
            word: "کالا", 
            letters: ["ک", "ا", "ل", "ا"], 
            meaning: "Black",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            imageLetter: "ک",
            hint: "رات کا رنگ",
            category: "رنگ"
        },
        { 
            word: "لال", 
            letters: ["ل", "ا", "ل"], 
            meaning: "Red",
            imageId: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            imageLetter: "ل",
            hint: "انار کا رنگ",
            category: "رنگ"
        },
        
        // Common Words
        { 
            word: "دوست", 
            letters: ["د", "و", "س", "ت"], 
            meaning: "Friend",
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            imageLetter: "د",
            hint: "جو ہمارے ساتھ کھیلے",
            category: "رشتہ"
        },
        { 
            word: "سکول", 
            letters: ["س", "ک", "و", "ل"], 
            meaning: "School",
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            imageLetter: "س",
            hint: "جہاں ہم پڑھتے ہیں",
            category: "مقام"
        },
        { 
            word: "استاد", 
            letters: ["ا", "س", "ت", "ا", "د"], 
            meaning: "Teacher",
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            imageLetter: "ع",
            hint: "جو ہمیں پڑھاتا ہے",
            category: "شخص"
        },
        { 
            word: "گاڑی", 
            letters: ["گ", "ا", "ڑ", "ی"], 
            meaning: "Vehicle/Car",
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            imageLetter: "گ",
            hint: "جس پر ہم سفر کرتے ہیں",
            category: "گاڑی"
        },
        { 
            word: "موبائل", 
            letters: ["م", "و", "ب", "ا", "ئ", "ل"], 
            meaning: "Mobile Phone",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            imageLetter: "م",
            hint: "بات کرنے کا آلہ",
            category: "الیکٹرانکس"
        },
        { 
            word: "پنکھا", 
            letters: ["پ", "ن", "ک", "ھ", "ا"], 
            meaning: "Fan",
            imageId: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz",
            imageLetter: "پ",
            hint: "ہوا کرنے والا",
            category: "چیز"
        },
        { 
            word: "ٹوپی", 
            letters: ["ٹ", "و", "پ", "ی"], 
            meaning: "Cap/Hat",
            imageId: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq",
            imageLetter: "ٹ",
            hint: "سر پر پہنتے ہیں",
            category: "لباس"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const shuffled = shuffleArray([...threeLetterWords]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w400`;
        const wordLetters = current.word.split('');
        const letterPool = shuffleArray([...wordLetters]);
        
        // Add extra random letters to make it challenging (but keep limited)
        const extraLetters = ['ا', 'ب', 'م', 'ل', 'و', 'ی', 'ن', 'ر', 'ک', 'ت'];
        for(let i = 0; i < 2; i++) {
            let randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            while(letterPool.includes(randomExtra)) {
                randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            }
            letterPool.push(randomExtra);
        }
        const finalLetterPool = shuffleArray([...letterPool]);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🔠 تین حرفی لفظ - سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ تین حروف ملا کر لفظ بنائیں ✨</div>
                    <img src="${imageUrl}" style="width: 130px; height: 130px; object-fit: cover; border-radius: 20px; margin: 10px auto; border: 3px solid white;"
                         onerror="this.src='https://via.placeholder.com/130x130/2563EB/white?text=${current.word}'">
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 10px 15px; margin: 15px auto; display: inline-block;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">📁 ${current.category}</div>
                        <div style="font-size: 0.9rem; color: #FCD34D;">💡 ${current.hint}</div>
                        <div style="font-size: 0.8rem; color: #93C5FD; margin-top: 5px;">🇬🇧 Meaning: ${current.meaning}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📝 نیچے سے حروف چن کر لفظ بنائیں: <span style="color:#F59E0B;">"${current.word}"</span></h3>
                
                <!-- Letter Pool -->
                <div id="letterPoolThree" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0;"></div>
                
                <!-- Word Building Area -->
                <div id="wordBuildThree" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; min-height: 80px; background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;"></div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearThreeBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkThreeBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevThreeBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextThreeBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate letter pool
        const letterPoolDiv = document.getElementById('letterPoolThree');
        finalLetterPool.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 20px; font-size: 1.8rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2);';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                const slots = document.querySelectorAll('#wordBuildThree .word-slot');
                for(let i = 0; i < slots.length; i++) {
                    if(slots[i].textContent === '') {
                        slots[i].textContent = letter;
                        slots[i].style.background = '#D1FAE5';
                        slots[i].style.border = '2px solid #10B981';
                        btn.style.opacity = '0.5';
                        btn.style.pointerEvents = 'none';
                        break;
                    }
                }
            };
            letterPoolDiv.appendChild(btn);
        });
        
        // Create word building slots
        const wordBuildDiv = document.getElementById('wordBuildThree');
        for(let i = 0; i < wordLetters.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'word-slot';
            slot.style.cssText = 'width: 70px; height: 70px; background: white; border: 2px solid #2563EB; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #2563EB; transition: all 0.2s;';
            slot.textContent = '';
            wordBuildDiv.appendChild(slot);
        }
        
        // Clear button
        document.getElementById('clearThreeBtn').onclick = () => {
            const slots = document.querySelectorAll('#wordBuildThree .word-slot');
            slots.forEach(slot => {
                slot.textContent = '';
                slot.style.background = 'white';
                slot.style.border = '2px solid #2563EB';
            });
            document.querySelectorAll('#letterPoolThree button').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            showToast('صاف کر دیا گیا! دوبارہ کوشش کریں', 'info');
        };
        
        // Check button
        document.getElementById('checkThreeBtn').onclick = () => {
            let userWord = '';
            const slots = document.querySelectorAll('#wordBuildThree .word-slot');
            slots.forEach(slot => {
                userWord += slot.textContent;
            });
            
            if(userWord === current.word) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! "${current.word}" لفظ درست بنایا! 🎉`, 'success');
                
                document.querySelectorAll('#letterPoolThree button').forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                });
                slots.forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.color = 'white';
                });
                document.getElementById('clearThreeBtn').style.pointerEvents = 'none';
                document.getElementById('checkThreeBtn').style.pointerEvents = 'none';
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح لفظ "${current.word}" ہے۔ دوبارہ کوشش کریں!`, 'error');
                
                slots.forEach(slot => {
                    slot.style.background = '#FEE2E2';
                    slot.style.border = '2px solid #EF4444';
                    setTimeout(() => {
                        if(slot.textContent === '') {
                            slot.style.background = 'white';
                            slot.style.border = '2px solid #2563EB';
                        } else {
                            slot.style.background = '#D1FAE5';
                            slot.style.border = '2px solid #10B981';
                        }
                    }, 500);
                });
            }
        };
        
        // Previous button
        document.getElementById('prevThreeBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextThreeBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب تین حرفی الفاظ درست بنائے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> تین حرفی الفاظ درست بنائے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod10Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod10Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🔠'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 20: METHOD 11 - چھپی ہوئی تصویر
// ========================================== */
// ========================================== */
// SECTION 20: METHOD 11 - چھپی ہوئی تصویر
// (Hidden Picture - Reveal on Correct Answer)
// حروف جوڑیں، تصویر کھلے
// 10-15 Random Questions | No Repeat
// ========================================== */

function method11_HiddenImage() {
    // ==========================================
    // HIDDEN PICTURE DATABASE
    // Each word has a hidden image that reveals on correct answer
    // ==========================================
    
    const hiddenImageDatabase = [
        // Animals (جانور)
        { 
            word: "بکری", 
            letters: ["ب", "ک", "ر", "ی"],
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            hint: "دودھ دینے والی جانور",
            category: "جانور",
            funFact: "بکری روزانہ 2-3 لیٹر دودھ دیتی ہے"
        },
        { 
            word: "شیر", 
            letters: ["ش", "ی", "ر"],
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            hint: "جنگل کا بادشاہ",
            category: "جانور",
            funFact: "شیر دن میں 20 گھنٹے سوتا ہے"
        },
        { 
            word: "ہاتھی", 
            letters: ["ہ", "ا", "ت", "ھ", "ی"],
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            hint: "بہت بڑا جانور",
            category: "جانور",
            funFact: "ہاتھی پانی بہت پسند کرتا ہے"
        },
        { 
            word: "اونٹ", 
            letters: ["ا", "و", "ن", "ٹ"],
            imageId: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz",
            hint: "صحرا کا جانور",
            category: "جانور",
            funFact: "اونٹ کئی دن بغیر پانی کے رہ سکتا ہے"
        },
        
        // Fruits (پھل)
        { 
            word: "انار", 
            letters: ["ا", "ن", "ا", "ر"],
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            hint: "سرخ رنگ کا پھل",
            category: "پھل",
            funFact: "انار میں بہت سے دانے ہوتے ہیں"
        },
        { 
            word: "آم", 
            letters: ["آ", "م"],
            imageId: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF",
            hint: "بادشاہ پھل",
            category: "پھل",
            funFact: "آم کو پھلوں کا بادشاہ کہا جاتا ہے"
        },
        { 
            word: "انگور", 
            letters: ["ا", "ن", "گ", "و", "ر"],
            imageId: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6",
            hint: "چھوٹے میٹھے پھل",
            category: "پھل",
            funFact: "انگور سے کشمش بنتی ہے"
        },
        
        // Objects (اشیاء)
        { 
            word: "کتاب", 
            letters: ["ک", "ت", "ا", "ب"],
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "جس میں ہم پڑھتے ہیں",
            category: "چیز",
            funFact: "کتاب ہماری بہترین دوست ہے"
        },
        { 
            word: "قلم", 
            letters: ["ق", "ل", "م"],
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            hint: "جس سے ہم لکھتے ہیں",
            category: "چیز",
            funFact: "قلم سے علم پھیلتا ہے"
        },
        { 
            word: "پنکھا", 
            letters: ["پ", "ن", "ک", "ھ", "ا"],
            imageId: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz",
            hint: "ہوا کرنے والا",
            category: "چیز",
            funFact: "پنکھا گرمی میں ٹھنڈک دیتا ہے"
        },
        
        // Birds (پرندے)
        { 
            word: "توتا", 
            letters: ["ت", "و", "ت", "ا"],
            imageId: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            hint: "سبز رنگ کا پرندہ",
            category: "پرندہ",
            funFact: "توتا بولنا سیکھ سکتا ہے"
        },
        { 
            word: "بلبل", 
            letters: ["ب", "ل", "ب", "ل"],
            imageId: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x",
            hint: "میٹھا گانے والا پرندہ",
            category: "پرندہ",
            funFact: "بلبل بہت میٹھا گاتی ہے"
        },
        
        // Vegetables (سبزیاں)
        { 
            word: "آلو", 
            letters: ["آ", "ل", "و"],
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            hint: "سبزی جو آلو ٹکا میں استعمال ہوتی ہے",
            category: "سبزی",
            funFact: "آلو دنیا بھر میں کھائی جاتی ہے"
        },
        { 
            word: "پیاز", 
            letters: ["پ", "ی", "ا", "ز"],
            imageId: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg",
            hint: "آنکھ میں آنسو لانے والی سبزی",
            category: "سبزی",
            funFact: "پیاز کاٹتے وقت آنسو آتے ہیں"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...hiddenImageDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let currentRevealLevel = 0; // 0=fully hidden, 5=fully revealed
    let selectedLetters = [];
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const wordLetters = current.letters;
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w400`;
        
        // Create letter pool with extra letters
        const extraLetters = ['ا', 'ب', 'م', 'ل', 'و', 'ی', 'ن', 'ر', 'ک', 'ت', 'س', 'د'];
        let letterPool = [...wordLetters];
        for(let i = 0; i < 3; i++) {
            let randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            while(letterPool.includes(randomExtra)) {
                randomExtra = extraLetters[Math.floor(Math.random() * extraLetters.length)];
            }
            letterPool.push(randomExtra);
        }
        letterPool = shuffleArray([...letterPool]);
        selectedLetters = [];
        currentRevealLevel = 0;
        
        // Generate blur levels for hidden image
        const blurLevels = ['blur(12px)', 'blur(10px)', 'blur(8px)', 'blur(5px)', 'blur(3px)', 'blur(0px)'];
        const currentBlur = blurLevels[currentRevealLevel];
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🎁 چھپی ہوئی تصویر - سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <!-- Hidden Image Area -->
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🎁 صحیح جواب دینے پر تصویر کھلے گی 🎁</div>
                    <div id="hiddenImageContainer" style="position: relative; width: 180px; height: 180px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 3px solid white;">
                        <img id="hiddenImage" src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; filter: ${currentBlur}; transition: filter 0.3s ease;">
                        <div id="revealOverlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; border-radius: 20px;">
                            <span style="font-size: 2rem; color: white;">🔒</span>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 10px; margin: 15px auto; max-width: 250px;">
                        <div style="font-size: 0.8rem; color: #93C5FD;">💡 ${current.hint}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📝 نیچے سے حروف چن کر لفظ بنائیں</h3>
                
                <!-- Selected Letters Display -->
                <div id="selectedLettersArea" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; min-height: 80px; background: #F3F4F6; border-radius: 20px; padding: 15px; margin: 15px 0; border: 2px solid #2563EB;"></div>
                
                <!-- Letter Pool -->
                <div id="letterPoolHidden" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0;"></div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearHiddenBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkHiddenBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevHiddenBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextHiddenBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate selected letters area
        const selectedArea = document.getElementById('selectedLettersArea');
        selectedArea.innerHTML = '<div style="color:#9CA3AF; width:100%; text-align:center;">🔘 حروف یہاں نظر آئیں گے</div>';
        
        // Populate letter pool
        const letterPoolDiv = document.getElementById('letterPoolHidden');
        letterPool.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 20px; font-size: 1.8rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2);';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(selectedLetters.length < wordLetters.length) {
                    selectedLetters.push(letter);
                    updateSelectedDisplay(wordLetters.length);
                    btn.style.opacity = '0.5';
                    btn.style.pointerEvents = 'none';
                } else {
                    showToast('لفظ مکمل ہو چکا ہے! پہلے صاف کریں', 'info');
                }
            };
            letterPoolDiv.appendChild(btn);
        });
        
        function updateSelectedDisplay(totalLength) {
            const selectedArea = document.getElementById('selectedLettersArea');
            if(selectedLetters.length === 0) {
                selectedArea.innerHTML = '<div style="color:#9CA3AF; width:100%; text-align:center;">🔘 حروف یہاں نظر آئیں گے</div>';
                return;
            }
            selectedArea.innerHTML = '';
            selectedLetters.forEach((letter, idx) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.cssText = 'width: 70px; height: 70px; background: #D1FAE5; border: 2px solid #10B981; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #059669;';
                selectedArea.appendChild(span);
            });
            // Add empty slots for remaining letters
            for(let i = selectedLetters.length; i < totalLength; i++) {
                const emptySlot = document.createElement('span');
                emptySlot.textContent = '?';
                emptySlot.style.cssText = 'width: 70px; height: 70px; background: #F3F4F6; border: 2px dashed #2563EB; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #9CA3AF;';
                selectedArea.appendChild(emptySlot);
            }
        }
        
        // Clear button
        document.getElementById('clearHiddenBtn').onclick = () => {
            selectedLetters = [];
            updateSelectedDisplay(wordLetters.length);
            document.querySelectorAll('#letterPoolHidden button').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            showToast('صاف کر دیا گیا!', 'info');
        };
        
        // Check button with progressive reveal
        document.getElementById('checkHiddenBtn').onclick = () => {
            const userWord = selectedLetters.join('');
            const targetWord = wordLetters.join('');
            
            if(userWord === targetWord) {
                // CORRECT - Reveal more of the image
                if(currentRevealLevel < 5) {
                    currentRevealLevel++;
                    const newBlur = blurLevels[currentRevealLevel];
                    document.getElementById('hiddenImage').style.filter = newBlur;
                    showToast(`🎉 شاباش! تصویر ${currentRevealLevel}/6 کھل گئی! 🎉`, 'success');
                    playClapping();
                    
                    if(currentRevealLevel === 3) {
                        showToast('💪 بہت خوب! آدھی تصویر کھل گئی!', 'success');
                    }
                    
                    if(currentRevealLevel === 5) {
                        document.getElementById('revealOverlay').style.display = 'none';
                        showToast(`🎊 مبارک! پوری تصویر کھل گئی! یہ ہے "${current.word}"! 🎊`, 'success');
                        showClapping();
                        
                        // Show fun fact
                        showToast(`📚 دلچسپ بات: ${current.funFact}`, 'info');
                        
                        // Disable further input
                        document.querySelectorAll('#letterPoolHidden button').forEach(btn => {
                            btn.style.pointerEvents = 'none';
                            btn.style.opacity = '0.5';
                        });
                        document.getElementById('clearHiddenBtn').style.pointerEvents = 'none';
                        document.getElementById('checkHiddenBtn').style.pointerEvents = 'none';
                        
                        // Add to score and move to next
                        score++;
                        setTimeout(() => {
                            if(currentIndex + 1 < totalQuestions) {
                                currentIndex++;
                                renderQuestion();
                            } else {
                                finishQuiz();
                            }
                        }, 2000);
                    }
                } else {
                    // Already fully revealed
                    document.getElementById('revealOverlay').style.display = 'none';
                }
            } else {
                showThumbDown();
                const remainingLetters = wordLetters.filter(l => !selectedLetters.includes(l));
                showToast(`❌ غلط! لفظ "${targetWord}" ہے۔ "${remainingLetters.join(', ')}" حروف باقی ہیں`, 'error');
                
                // Shake effect
                const selectedArea = document.getElementById('selectedLettersArea');
                selectedArea.style.animation = 'shake 0.3s';
                setTimeout(() => selectedArea.style.animation = '', 300);
            }
        };
        
        // Previous button
        document.getElementById('prevHiddenBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextHiddenBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب تصاویر کھول لیں! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> تصاویر کھولیں</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod11Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod11Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🎁'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 21: METHOD 12 - میچنگ گیم
// ========================================== */
// ========================================== */
// SECTION 21: METHOD 12 - میچنگ گیم
// (Matching Game - Match Picture to Correct Word)
// تصویر کو درست لفظ سے جوڑیں
// 10-15 Random Questions | No Repeat
// ========================================== */

function method12_MatchingGame() {
    // ==========================================
    // MATCHING GAME DATABASE
    // Each item has an image and matching word
    // ==========================================
    
    const matchingDatabase = [
        // Animals (جانور)
        { 
            id: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            word: "بکری", 
            category: "جانور",
            hint: "دودھ دینے والی"
        },
        { 
            id: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            word: "شیر", 
            category: "جانور",
            hint: "جنگل کا بادشاہ"
        },
        { 
            id: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            word: "ہاتھی", 
            category: "جانور",
            hint: "بہت بڑا جانور"
        },
        { 
            id: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz",
            word: "اونٹ", 
            category: "جانور",
            hint: "صحرا کا جانور"
        },
        { 
            id: "195uQPWZsukNoAkVDipAdzStzStdOeAWH",
            word: "بلی", 
            category: "جانور",
            hint: "میاؤں میاؤں"
        },
        { 
            id: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            word: "بیل", 
            category: "جانور",
            hint: "ہل چلانے والا"
        },
        
        // Fruits (پھل)
        { 
            id: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            word: "انار", 
            category: "پھل",
            hint: "سرخ رنگ کا پھل"
        },
        { 
            id: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF",
            word: "آم", 
            category: "پھل",
            hint: "بادشاہ پھل"
        },
        { 
            id: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6",
            word: "انگور", 
            category: "پھل",
            hint: "چھوٹے میٹھے پھل"
        },
        { 
            id: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            word: "تربوز", 
            category: "پھل",
            hint: "بڑا میٹھا پھل"
        },
        
        // Objects (اشیاء)
        { 
            id: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            word: "کتاب", 
            category: "چیز",
            hint: "جس میں ہم پڑھتے ہیں"
        },
        { 
            id: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            word: "قلم", 
            category: "چیز",
            hint: "جس سے ہم لکھتے ہیں"
        },
        { 
            id: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            word: "میز", 
            category: "چیز",
            hint: "جس پر ہم کھانا کھاتے ہیں"
        },
        { 
            id: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz",
            word: "پنکھا", 
            category: "چیز",
            hint: "ہوا کرنے والا"
        },
        { 
            id: "100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd",
            word: "پنسل", 
            category: "چیز",
            hint: "لکھنے والی چیز"
        },
        { 
            id: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq",
            word: "ٹوپی", 
            category: "چیز",
            hint: "سر پر پہنتے ہیں"
        },
        { 
            id: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa",
            word: "جوتا", 
            category: "چیز",
            hint: "پاؤں میں پہنتے ہیں"
        },
        
        // Birds (پرندے)
        { 
            id: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            word: "توتا", 
            category: "پرندہ",
            hint: "سبز رنگ کا پرندہ"
        },
        { 
            id: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x",
            word: "بلبل", 
            category: "پرندہ",
            hint: "میٹھا گانے والا پرندہ"
        },
        
        // Vegetables (سبزیاں)
        { 
            id: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            word: "آلو", 
            category: "سبزی",
            hint: "آلو ٹکا میں استعمال ہوتی ہے"
        },
        { 
            id: "1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg",
            word: "پیاز", 
            category: "سبزی",
            hint: "آنکھ میں آنسو لائے"
        },
        
        // Colors (رنگ)
        { 
            id: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            word: "نیلا", 
            category: "رنگ",
            hint: "آسمان کا رنگ"
        },
        { 
            id: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            word: "لال", 
            category: "رنگ",
            hint: "انار کا رنگ"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (8-12 matches, no repeat)
    function getRandomMatches() {
        const totalMatches = Math.floor(Math.random() * 5) + 8; // 8 to 12 matches
        const shuffled = shuffleArray([...matchingDatabase]);
        return shuffled.slice(0, totalMatches);
    }
    
    let matches = getRandomMatches();
    let gameState = {
        items: [],
        selectedImage: null,
        selectedWord: null,
        matchedPairs: 0,
        score: 0,
        attempts: 0
    };
    
    function initGame() {
        // Create left side items (images) and right side items (words)
        const leftItems = matches.map((item, idx) => ({
            id: idx,
            type: 'image',
            data: item,
            matched: false
        }));
        
        const rightItems = shuffleArray([...matches]).map((item, idx) => ({
            id: idx,
            type: 'word',
            data: item,
            matched: false
        }));
        
        gameState.items = [...leftItems, ...rightItems];
        gameState.selectedImage = null;
        gameState.selectedWord = null;
        gameState.matchedPairs = 0;
        gameState.attempts = 0;
        
        renderGame();
    }
    
    function renderGame() {
        const leftItems = gameState.items.filter(i => i.type === 'image');
        const rightItems = gameState.items.filter(i => i.type === 'word');
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🎯 میچنگ گیم - ${gameState.matchedPairs} / ${matches.length} جوڑے ملے</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${(gameState.matchedPairs / matches.length) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ تصویر کو درست لفظ سے جوڑیں ✨</div>
                    <div style="font-size: 0.8rem; color: #93C5FD;">📊 کوششیں: ${gameState.attempts} | جوڑے: ${gameState.matchedPairs}/${matches.length}</div>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
                    <!-- Left Side - Images -->
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="color: #2563EB; margin-bottom: 15px;">🖼️ تصاویر</h3>
                        <div id="imagesContainer" style="display: flex; flex-direction: column; gap: 15px;"></div>
                    </div>
                    
                    <!-- Right Side - Words -->
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="color: #2563EB; margin-bottom: 15px;">📝 الفاظ</h3>
                        <div id="wordsContainer" style="display: flex; flex-direction: column; gap: 15px;"></div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button id="resetMatchBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 50px; cursor: pointer;">🔄 دوبارہ شروع کریں</button>
                    <button id="finishMatchBtn" style="background: #10B981; color: white; padding: 12px 30px; border: none; border-radius: 50px; cursor: pointer;" ${gameState.matchedPairs < matches.length ? 'disabled style="opacity:0.5;"' : ''}>✅ مکمل کیا</button>
                </div>
            </div>
        `;
        
        // Render images side
        const imagesContainer = document.getElementById('imagesContainer');
        leftItems.forEach(item => {
            const imageUrl = `https://drive.google.com/thumbnail?id=${item.data.id}&sz=w200`;
            const card = document.createElement('div');
            card.className = 'match-card';
            card.style.cssText = `
                background: ${item.matched ? '#D1FAE5' : 'white'};
                border: 2px solid ${gameState.selectedImage === item.id ? '#F59E0B' : '#2563EB'};
                border-radius: 15px;
                padding: 15px;
                cursor: ${item.matched ? 'default' : 'pointer'};
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 15px;
                opacity: ${item.matched ? 0.6 : 1};
            `;
            
            if (!item.matched) {
                card.onmouseenter = () => card.style.transform = 'scale(1.02)';
                card.onmouseleave = () => card.style.transform = 'scale(1)';
                card.onclick = () => selectImage(item.id);
            }
            
            card.innerHTML = `
                <img src="${imageUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px;" 
                     onerror="this.src='https://via.placeholder.com/60x60/2563EB/white?text=${item.data.word}'">
                <div style="flex: 1; text-align: right;">
                    <div style="font-size: 0.7rem; color: #6B7280;">${item.data.category}</div>
                    <div style="font-size: 0.8rem; color: #F59E0B;">💡 ${item.data.hint}</div>
                </div>
                ${item.matched ? '<span style="font-size: 1.5rem;">✅</span>' : ''}
            `;
            imagesContainer.appendChild(card);
        });
        
        // Render words side
        const wordsContainer = document.getElementById('wordsContainer');
        rightItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.style.cssText = `
                background: ${item.matched ? '#D1FAE5' : 'white'};
                border: 2px solid ${gameState.selectedWord === item.id ? '#F59E0B' : '#2563EB'};
                border-radius: 15px;
                padding: 15px;
                cursor: ${item.matched ? 'default' : 'pointer'};
                transition: all 0.2s;
                text-align: center;
                opacity: ${item.matched ? 0.6 : 1};
                font-size: 1.3rem;
                font-weight: bold;
                color: #1F2937;
            `;
            
            if (!item.matched) {
                card.onmouseenter = () => card.style.transform = 'scale(1.02)';
                card.onmouseleave = () => card.style.transform = 'scale(1)';
                card.onclick = () => selectWord(item.id);
            }
            
            card.innerHTML = `
                ${item.data.word}
                ${item.matched ? '<span style="font-size: 1.5rem; margin-left: 10px;">✅</span>' : ''}
            `;
            wordsContainer.appendChild(card);
        });
        
        // Reset button
        document.getElementById('resetMatchBtn').onclick = () => {
            initGame();
            showToast('گیم دوبارہ شروع ہو گئی!', 'info');
        };
        
        // Finish button
        document.getElementById('finishMatchBtn').onclick = () => {
            if(gameState.matchedPairs === matches.length) {
                finishGame();
            }
        };
    }
    
    function selectImage(imageId) {
        if (gameState.selectedImage === imageId) {
            // Deselect
            gameState.selectedImage = null;
            renderGame();
            return;
        }
        
        gameState.selectedImage = imageId;
        
        // If there's a selected word, check match
        if (gameState.selectedWord !== null) {
            checkMatch(gameState.selectedImage, gameState.selectedWord);
        } else {
            renderGame();
        }
    }
    
    function selectWord(wordId) {
        if (gameState.selectedWord === wordId) {
            gameState.selectedWord = null;
            renderGame();
            return;
        }
        
        gameState.selectedWord = wordId;
        
        if (gameState.selectedImage !== null) {
            checkMatch(gameState.selectedImage, gameState.selectedWord);
        } else {
            renderGame();
        }
    }
    
    function checkMatch(imageId, wordId) {
        gameState.attempts++;
        
        const imageItem = gameState.items.find(i => i.id === imageId && i.type === 'image');
        const wordItem = gameState.items.find(i => i.id === wordId && i.type === 'word');
        
        if (!imageItem || !wordItem) return;
        
        const isMatch = (imageItem.data.word === wordItem.data.word);
        
        if (isMatch) {
            // Correct match
            imageItem.matched = true;
            wordItem.matched = true;
            gameState.matchedPairs++;
            gameState.score++;
            showClapping();
            playClapping();
            showToast(`🎉 بہت خوب! "${imageItem.data.word}" درست جوڑ دیا! 🎉`, 'success');
            
            gameState.selectedImage = null;
            gameState.selectedWord = null;
            renderGame();
        } else {
            // Wrong match
            showThumbDown();
            showToast(`❌ غلط! "${imageItem.data.word}" تصویر کا جوڑ "${imageItem.data.word}" ہے۔ دوبارہ کوشش کریں!`, 'error');
            
            // Show correct answer briefly
            const correctWord = imageItem.data.word;
            showToast(`💡 صحیح جوڑ: ${correctWord}`, 'info');
            
            gameState.selectedImage = null;
            gameState.selectedWord = null;
            renderGame();
        }
    }
    
    function finishGame() {
        const percentage = Math.round((gameState.score / matches.length) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب جوڑے درست ملائے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${matches.length}</strong> میں سے <strong>${gameState.score}</strong> جوڑے درست ملائے</p>
                <p style="font-size:1rem;">📊 کل کوششیں: ${gameState.attempts}</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${gameState.score}/${matches.length} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMatchGameBtn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMatchGameBtn').onclick = () => {
            totalScore += gameState.score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${gameState.score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🎲'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    initGame();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 22: METHOD 14 - ابتدائی/وسطی شکل
// ========================================== */
// ========================================== */
// SECTION 22: METHOD 14 - ابتدائی/وسطی شکل
// (Initial/Medial Form of Urdu Letters)
// حروف کی مختلف شکلیں پہچانیں
// 15-20 Random Questions | No Repeat
// ========================================== */

function method14_LetterShapes() {
    // ==========================================
    // URDU LETTERS WITH THEIR FORMS
    // Each letter has: Initial, Medial, Final, Isolated forms
    // ==========================================
    
    const letterFormsDatabase = [
        // Letter: Bay (ب)
        { 
            letter: "ب",
            name: "بے",
            isolated: "ب",
            initial: "ﺑ",
            medial: "ﺒ",
            final: "ﺐ",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            exampleWord: "بکری",
            hint: "یہ حرف 'ب' ہے - تین نقطے نیچے"
        },
        // Letter: Pay (پ)
        { 
            letter: "پ",
            name: "پے",
            isolated: "پ",
            initial: "ﭘ",
            medial: "ﭙ",
            final: "ﭗ",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            exampleWord: "پانی",
            hint: "یہ حرف 'پ' ہے - تین نقطے اوپر"
        },
        // Letter: Tay (ت)
        { 
            letter: "ت",
            name: "تے",
            isolated: "ت",
            initial: "ﺗ",
            medial: "ﺘ",
            final: "ﺖ",
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            exampleWord: "توتا",
            hint: "یہ حرف 'ت' ہے - دو نقطے اوپر"
        },
        // Letter: Say (س)
        { 
            letter: "س",
            name: "سین",
            isolated: "س",
            initial: "ﺳ",
            medial: "ﺴ",
            final: "ﺲ",
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            exampleWord: "سکول",
            hint: "یہ حرف 'س' ہے - تین دانت"
        },
        // Letter: Sheen (ش)
        { 
            letter: "ش",
            name: "شین",
            isolated: "ش",
            initial: "ﺷ",
            medial: "ﺸ",
            final: "ﺶ",
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            exampleWord: "شیر",
            hint: "یہ حرف 'ش' ہے - تین نقطے اوپر"
        },
        // Letter: Jeem (ج)
        { 
            letter: "ج",
            name: "جیم",
            isolated: "ج",
            initial: "ﺟ",
            medial: "ﺠ",
            final: "ﺞ",
            imageId: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa",
            exampleWord: "جوتا",
            hint: "یہ حرف 'ج' ہے - ایک نقطہ نیچے"
        },
        // Letter: Che (چ)
        { 
            letter: "چ",
            name: "چے",
            isolated: "چ",
            initial: "ﭼ",
            medial: "ﭽ",
            final: "ﭻ",
            imageId: "1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z",
            exampleWord: "چائے",
            hint: "یہ حرف 'چ' ہے - تین نقطے نیچے"
        },
        // Letter: Hey (ح)
        { 
            letter: "ح",
            name: "حے",
            isolated: "ح",
            initial: "ﺣ",
            medial: "ﺤ",
            final: "ﺢ",
            imageId: "1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC",
            exampleWord: "حلوہ",
            hint: "یہ حرف 'ح' ہے - بغیر نقطے"
        },
        // Letter: Khay (خ)
        { 
            letter: "خ",
            name: "خے",
            isolated: "خ",
            initial: "ﺧ",
            medial: "ﺨ",
            final: "ﺦ",
            imageId: "1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2",
            exampleWord: "خوبانی",
            hint: "یہ حرف 'خ' ہے - ایک نقطہ اوپر"
        },
        // Letter: Dal (د)
        { 
            letter: "د",
            name: "دال",
            isolated: "د",
            initial: "د",
            medial: "د",
            final: "د",
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            exampleWord: "دودھ",
            hint: "یہ حرف 'د' ہے - جوڑ نہیں بنتا"
        },
        // Letter: Ray (ر)
        { 
            letter: "ر",
            name: "رے",
            isolated: "ر",
            initial: "ر",
            medial: "ر",
            final: "ر",
            imageId: "1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF",
            exampleWord: "روٹی",
            hint: "یہ حرف 'ر' ہے - جوڑ نہیں بنتا"
        },
        // Letter: Zay (ز)
        { 
            letter: "ز",
            name: "زے",
            isolated: "ز",
            initial: "ز",
            medial: "ز",
            final: "ز",
            imageId: "1Yia5WCaxAEiZ0TeYTbMkqTkPvTs91fK-",
            exampleWord: "زمین",
            hint: "یہ حرف 'ز' ہے - ایک نقطہ اوپر"
        },
        // Letter: Seen (ص)
        { 
            letter: "ص",
            name: "صاد",
            isolated: "ص",
            initial: "ﺻ",
            medial: "ﺼ",
            final: "ﺺ",
            imageId: "18pQ2i_5GQoDh2RnMg9_xTNrkanAUT5NB",
            exampleWord: "صابن",
            hint: "یہ حرف 'ص' ہے - گول شکل"
        },
        // Letter: Kaaf (ک)
        { 
            letter: "ک",
            name: "کاف",
            isolated: "ک",
            initial: "ﮐ",
            medial: "ﮑ",
            final: "ﮏ",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            exampleWord: "کتاب",
            hint: "یہ حرف 'ک' ہے - دو خط"
        },
        // Letter: Gaaf (گ)
        { 
            letter: "گ",
            name: "گاف",
            isolated: "گ",
            initial: "ﮔ",
            medial: "ﮕ",
            final: "ﮓ",
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            exampleWord: "گھر",
            hint: "یہ حرف 'گ' ہے - تین خط"
        },
        // Letter: Laam (ل)
        { 
            letter: "ل",
            name: "لام",
            isolated: "ل",
            initial: "ﻟ",
            medial: "ﻠ",
            final: "ﻞ",
            imageId: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            exampleWord: "لال",
            hint: "یہ حرف 'ل' ہے - لمبا"
        },
        // Letter: Meem (م)
        { 
            letter: "م",
            name: "میم",
            isolated: "م",
            initial: "ﻣ",
            medial: "ﻤ",
            final: "ﻢ",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            exampleWord: "میز",
            hint: "یہ حرف 'م' ہے - گول"
        },
        // Letter: Noon (ن)
        { 
            letter: "ن",
            name: "نون",
            isolated: "ن",
            initial: "ﻧ",
            medial: "ﻨ",
            final: "ﻦ",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            exampleWord: "نیلا",
            hint: "یہ حرف 'ن' ہے - ایک نقطہ اوپر"
        },
        // Letter: Wow (و)
        { 
            letter: "و",
            name: "واؤ",
            isolated: "و",
            initial: "و",
            medial: "و",
            final: "و",
            imageId: "1nLc0dnqvPOE0tvo2LUMGkd1K9bTx-PWU",
            exampleWord: "والد",
            hint: "یہ حرف 'و' ہے - جوڑ نہیں بنتا"
        },
        // Letter: Hey (ہ)
        { 
            letter: "ہ",
            name: "ہے",
            isolated: "ہ",
            initial: "ﮨ",
            medial: "ﮩ",
            final: "ﮧ",
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            exampleWord: "ہاتھی",
            hint: "یہ حرف 'ہ' ہے - دو آنکھ"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Define question types
    const questionTypes = [
        { type: 'initial', question: 'اس حرف کی "ابتدائی" شکل کون سی ہے؟', formField: 'initial' },
        { type: 'medial', question: 'اس حرف کی "وسطی" شکل کون سی ہے؟', formField: 'medial' },
        { type: 'final', question: 'اس حرف کی "آخری" شکل کون سی ہے؟', formField: 'final' },
        { type: 'isolated', question: 'اس حرف کی "الگ" شکل کون سی ہے؟', formField: 'isolated' }
    ];
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const questions = [];
        const usedLetters = new Set();
        
        while(questions.length < totalQuestions && usedLetters.size < letterFormsDatabase.length) {
            const randomLetter = letterFormsDatabase[Math.floor(Math.random() * letterFormsDatabase.length)];
            const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const questionKey = `${randomLetter.letter}_${randomType.type}`;
            
            if(!usedLetters.has(questionKey)) {
                usedLetters.add(questionKey);
                questions.push({
                    letterData: randomLetter,
                    questionType: randomType
                });
            }
        }
        
        return questions;
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctForm, letterData) {
        // Get all unique forms from all letters to create options
        const allForms = [];
        letterFormsDatabase.forEach(l => {
            allForms.push(l.initial, l.medial, l.final, l.isolated);
        });
        
        let options = [correctForm];
        while(options.length < 4) {
            const randomForm = allForms[Math.floor(Math.random() * allForms.length)];
            if(!options.includes(randomForm) && randomForm !== '') {
                options.push(randomForm);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const letterData = current.letterData;
        const questionType = current.questionType;
        const correctForm = letterData[questionType.formField];
        const imageUrl = `https://drive.google.com/thumbnail?id=${letterData.imageId}&sz=w200`;
        const options = generateOptions(correctForm, letterData);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🎨 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">✨ حروف کی مختلف شکلیں سیکھیں ✨</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <img src="${imageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 20px; border: 2px solid white;"
                                 onerror="this.src='https://via.placeholder.com/100x100/2563EB/white?text=${letterData.letter}'">
                            <div style="margin-top: 5px; font-size: 0.8rem; color: #93C5FD;">مثال: ${letterData.exampleWord}</div>
                        </div>
                        <div style="font-size: 2rem; color: #FCD34D;">→</div>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 20px; text-align: center;">
                            <div style="font-size: 1rem; color: #93C5FD;">حرف <span style="color:#FCD34D;">${letterData.name}</span></div>
                            <div style="font-size: 0.8rem; color: #93C5FD;">${letterData.hint}</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 12px; margin: 15px auto; max-width: 300px;">
                        <div style="font-size: 1rem; color: #FCD34D;">💡 ${questionType.question}</div>
                    </div>
                </div>
                
                <div id="shapeOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 500px; margin: 20px auto;"></div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevShapeBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextShapeBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('shapeOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 3rem;">${opt}</div><div style="font-size: 0.7rem;">شکل</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer; transition: all 0.2s; text-align: center;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === correctForm) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${letterData.name}" کی ${questionType.type} شکل درست پہچانی! 🎉`, 'success');
                    
                    document.querySelectorAll('#shapeOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! صحیح شکل "${correctForm}" ہے۔ دوبارہ دیکھیں!`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevShapeBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextShapeBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب حروف کی شکلیں درست پہچانیں! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> حروف کی شکلیں درست پہچانیں</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod14Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod14Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🎨'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 23: METHOD 15 - ٹوٹے حروف
// ========================================== */
// ========================================== */
// SECTION 23: METHOD 15 - ٹوٹے حروف کو جوڑنا
// (Join Broken Letters - Puzzle Pieces)
// حروف کے دو ٹکڑوں کو جوڑ کر مکمل حرف بنائیں
// 15-20 Random Questions | No Repeat
// ========================================== */

function method15_BrokenLetters() {
    // ==========================================
    // BROKEN LETTERS DATABASE
    // Each letter is split into two parts (top/bottom or left/right)
    // ==========================================
    
    const brokenLettersDatabase = [
        // Letter: Alif (ا)
        { 
            letter: "ا",
            name: "الف",
            part1: "︎",  // Upper part of Alif
            part2: "ا",   // Lower part of Alif
            imageId: "1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_",
            hint: "سب سے پہلا حرف",
            fullForm: "ا"
        },
        // Letter: Bay (ب)
        { 
            letter: "ب",
            name: "بے",
            part1: "ـ",
            part2: "ب",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            hint: "تین نقطے نیچے",
            fullForm: "ب"
        },
        // Letter: Pay (پ)
        { 
            letter: "پ",
            name: "پے",
            part1: "ـ",
            part2: "پ",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            hint: "تین نقطے اوپر",
            fullForm: "پ"
        },
        // Letter: Tay (ت)
        { 
            letter: "ت",
            name: "تے",
            part1: "ـ",
            part2: "ت",
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            hint: "دو نقطے اوپر",
            fullForm: "ت"
        },
        // Letter: Say (س)
        { 
            letter: "س",
            name: "سین",
            part1: "سـ",
            part2: "ـس",
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            hint: "تین دانت",
            fullForm: "س"
        },
        // Letter: Sheen (ش)
        { 
            letter: "ش",
            name: "شین",
            part1: "شـ",
            part2: "ـش",
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            hint: "تین نقطے اوپر",
            fullForm: "ش"
        },
        // Letter: Jeem (ج)
        { 
            letter: "ج",
            name: "جیم",
            part1: "جـ",
            part2: "ـج",
            imageId: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa",
            hint: "ایک نقطہ نیچے",
            fullForm: "ج"
        },
        // Letter: Che (چ)
        { 
            letter: "چ",
            name: "چے",
            part1: "چـ",
            part2: "ـچ",
            imageId: "1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z",
            hint: "تین نقطے نیچے",
            fullForm: "چ"
        },
        // Letter: Hey (ح)
        { 
            letter: "ح",
            name: "حے",
            part1: "حـ",
            part2: "ـح",
            imageId: "1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC",
            hint: "بغیر نقطے",
            fullForm: "ح"
        },
        // Letter: Khay (خ)
        { 
            letter: "خ",
            name: "خے",
            part1: "خـ",
            part2: "ـخ",
            imageId: "1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2",
            hint: "ایک نقطہ اوپر",
            fullForm: "خ"
        },
        // Letter: Dal (د)
        { 
            letter: "د",
            name: "دال",
            part1: "ـ",
            part2: "د",
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            hint: "جوڑ نہیں بنتا",
            fullForm: "د"
        },
        // Letter: Ray (ر)
        { 
            letter: "ر",
            name: "رے",
            part1: "ـ",
            part2: "ر",
            imageId: "1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF",
            hint: "جوڑ نہیں بنتا",
            fullForm: "ر"
        },
        // Letter: Kaaf (ک)
        { 
            letter: "ک",
            name: "کاف",
            part1: "کـ",
            part2: "ـک",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "دو خط",
            fullForm: "ک"
        },
        // Letter: Gaaf (گ)
        { 
            letter: "گ",
            name: "گاف",
            part1: "گـ",
            part2: "ـگ",
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            hint: "تین خط",
            fullForm: "گ"
        },
        // Letter: Laam (ل)
        { 
            letter: "ل",
            name: "لام",
            part1: "لـ",
            part2: "ـل",
            imageId: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            hint: "لمبا",
            fullForm: "ل"
        },
        // Letter: Meem (م)
        { 
            letter: "م",
            name: "میم",
            part1: "مـ",
            part2: "ـم",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            hint: "گول",
            fullForm: "م"
        },
        // Letter: Noon (ن)
        { 
            letter: "ن",
            name: "نون",
            part1: "نـ",
            part2: "ـن",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            hint: "ایک نقطہ اوپر",
            fullForm: "ن"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const shuffled = shuffleArray([...brokenLettersDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let selectedParts = { part1: false, part2: false };
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w200`;
        selectedParts = { part1: false, part2: false };
        
        // Create puzzle pieces
        const pieces = [
            { id: 'part1', display: current.part1 === 'ـ' ? '⚫' : current.part1, label: 'پہلا ٹکڑا' },
            { id: 'part2', display: current.part2, label: 'دوسرا ٹکڑا' }
        ];
        const shuffledPieces = shuffleArray([...pieces]);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🧩 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🧩 ٹوٹے ہوئے ٹکڑوں کو جوڑ کر حرف بنائیں 🧩</div>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <img src="${imageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 20px; border: 2px solid white;"
                                 onerror="this.src='https://via.placeholder.com/100x100/2563EB/white?text=${current.letter}'">
                            <div style="margin-top: 5px; font-size: 0.8rem; color: #93C5FD;">${current.name}</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 12px; margin: 15px auto; max-width: 300px;">
                        <div style="font-size: 0.9rem; color: #FCD34D;">💡 ${current.hint}</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📦 ان ٹکڑوں کو صحیح ترتیب میں جوڑیں</h3>
                
                <!-- Puzzle Pieces (Drag Source) -->
                <div style="background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 10px;">📦 ٹوٹے ہوئے ٹکڑے (یہاں سے گھسیٹیں)</div>
                    <div id="puzzlePiecesSource" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;"></div>
                </div>
                
                <!-- Puzzle Assembly Area -->
                <div style="background: #E0E7FF; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;">
                    <div style="font-size: 0.8rem; color: #2563EB; margin-bottom: 10px;">🎯 حرف یہاں بنائیں</div>
                    <div id="puzzleAssemblyArea" style="display: flex; gap: 5px; justify-content: center; align-items: center; min-height: 120px;"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearPuzzleBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkPuzzleBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevPuzzleBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextPuzzleBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate puzzle pieces source
        const sourceContainer = document.getElementById('puzzlePiecesSource');
        shuffledPieces.forEach(piece => {
            const pieceDiv = document.createElement('div');
            pieceDiv.setAttribute('data-piece-id', piece.id);
            pieceDiv.setAttribute('data-piece-display', piece.display);
            pieceDiv.textContent = piece.display;
            pieceDiv.style.cssText = `
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #F59E0B, #D97706);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                border-radius: 15px;
                cursor: grab;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                transition: all 0.2s;
            `;
            pieceDiv.onmouseenter = () => pieceDiv.style.transform = 'scale(1.05)';
            pieceDiv.onmouseleave = () => pieceDiv.style.transform = 'scale(1)';
            pieceDiv.draggable = true;
            pieceDiv.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    id: piece.id,
                    display: piece.display
                }));
            };
            sourceContainer.appendChild(pieceDiv);
        });
        
        // Create assembly slots (2 slots for the 2 pieces)
        const assemblyArea = document.getElementById('puzzleAssemblyArea');
        const slots = [
            { position: 0, label: 'پہلا ٹکڑا', filled: false, content: '' },
            { position: 1, label: 'دوسرا ٹکڑا', filled: false, content: '' }
        ];
        
        slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.setAttribute('data-slot-position', slot.position);
            slotDiv.style.cssText = `
                width: 100px;
                height: 100px;
                border: 2px dashed #2563EB;
                border-radius: 15px;
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: white;
                margin: 0 5px;
                transition: all 0.2s;
            `;
            slotDiv.innerHTML = `<div style="font-size: 0.7rem; color: #9CA3AF;">${slot.label}</div><div style="font-size: 1.5rem; margin-top: 5px;">?</div>`;
            slotDiv.ondragover = (e) => e.preventDefault();
            slotDiv.ondrop = (e) => {
                e.preventDefault();
                const pieceData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const currentSlot = slots[slot.position];
                
                if (!currentSlot.filled) {
                    // Fill the slot
                    currentSlot.filled = true;
                    currentSlot.content = pieceData.display;
                    currentSlot.pieceId = pieceData.id;
                    slotDiv.innerHTML = `<div style="font-size: 0.7rem; color: #10B981;">${slot.label}</div><div style="font-size: 2rem;">${pieceData.display}</div>`;
                    slotDiv.style.background = '#D1FAE5';
                    slotDiv.style.border = '2px solid #10B981';
                    
                    // Remove the piece from source
                    const sourceElement = document.querySelector(`#puzzlePiecesSource div[data-piece-id="${pieceData.id}"]`);
                    if (sourceElement) sourceElement.remove();
                }
            };
            assemblyArea.appendChild(slotDiv);
        });
        
        // Clear button
        document.getElementById('clearPuzzleBtn').onclick = () => {
            // Reset assembly slots
            const slotDivs = document.querySelectorAll('#puzzleAssemblyArea div');
            slotDivs.forEach((slotDiv, idx) => {
                slots[idx].filled = false;
                slots[idx].content = '';
                slots[idx].pieceId = null;
                slotDiv.innerHTML = `<div style="font-size: 0.7rem; color: #9CA3AF;">${slots[idx].label}</div><div style="font-size: 1.5rem; margin-top: 5px;">?</div>`;
                slotDiv.style.background = 'white';
                slotDiv.style.border = '2px dashed #2563EB';
            });
            
            // Restore all pieces to source
            const sourceContainer = document.getElementById('puzzlePiecesSource');
            sourceContainer.innerHTML = '';
            shuffledPieces.forEach(piece => {
                const pieceDiv = document.createElement('div');
                pieceDiv.setAttribute('data-piece-id', piece.id);
                pieceDiv.setAttribute('data-piece-display', piece.display);
                pieceDiv.textContent = piece.display;
                pieceDiv.style.cssText = `
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    border-radius: 15px;
                    cursor: grab;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                `;
                pieceDiv.draggable = true;
                pieceDiv.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        id: piece.id,
                        display: piece.display
                    }));
                };
                sourceContainer.appendChild(pieceDiv);
            });
            
            showToast('صاف کر دیا گیا! دوبارہ جوڑیں', 'info');
        };
        
        // Check button
        document.getElementById('checkPuzzleBtn').onclick = () => {
            // Get the assembled word from slots in order
            let assembled = '';
            for(let i = 0; i < slots.length; i++) {
                assembled += slots[i].content || '';
            }
            
            // Check if assembled correctly
            const isCorrect = (assembled === current.fullForm || 
                              assembled === current.letter ||
                              (current.part1 + current.part2 === assembled));
            
            if (isCorrect) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 شاباش! "${current.letter}" حرف درست جوڑ دیا! 🎉`, 'success');
                
                // Disable drag and drop
                document.querySelectorAll('#puzzlePiecesSource div').forEach(div => {
                    div.draggable = false;
                    div.style.opacity = '0.5';
                });
                document.getElementById('clearPuzzleBtn').style.pointerEvents = 'none';
                document.getElementById('checkPuzzleBtn').style.pointerEvents = 'none';
                
                // Highlight all slots green
                const slotDivs = document.querySelectorAll('#puzzleAssemblyArea div');
                slotDivs.forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.border = '2px solid #10B981';
                });
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح حرف "${current.letter}" ہے۔ دوبارہ جوڑیں!`, 'error');
                
                // Shake animation on assembly area
                const assemblyArea = document.getElementById('puzzleAssemblyArea');
                assemblyArea.style.animation = 'shake 0.3s';
                setTimeout(() => assemblyArea.style.animation = '', 300);
            }
        };
        
        // Previous button
        document.getElementById('prevPuzzleBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextPuzzleBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب ٹوٹے حروف درست جوڑے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> ٹوٹے حروف درست جوڑے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod15Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod15Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🧩'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 24: METHOD 16 - دائیں سے بائیں جوڑ
// ========================================== */
// ========================================== */
// SECTION 24: METHOD 16 - دائیں سے بائیں جوڑ
// (Right to Left Joining - Urdu Writing Direction)
// اردو قاعدے کے مطابق حروف کو دائیں سے بائیں ترتیب دیں
// 10-15 Random Questions | No Repeat
// ========================================== */

function method16_RightToLeft() {
    // ==========================================
    // WORDS DATABASE - Practice Right to Left joining
    // Each word shows letters in wrong order (left to right)
    // Student must arrange them right to left
    // ==========================================
    
    const wordsDatabase = [
        // 2-letter words
        { 
            word: "با",
            correctOrder: ["ب", "ا"],
            wrongOrder: ["ا", "ب"],
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            hint: "پہلا حرف 'ب' پھر 'ا'",
            meaning: "کے ساتھ"
        },
        { 
            word: "تا",
            correctOrder: ["ت", "ا"],
            wrongOrder: ["ا", "ت"],
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            hint: "پہلا حرف 'ت' پھر 'ا'",
            meaning: "تک"
        },
        { 
            word: "پا",
            correctOrder: ["پ", "ا"],
            wrongOrder: ["ا", "پ"],
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            hint: "پہلا حرف 'پ' پھر 'ا'",
            meaning: "پاؤں"
        },
        { 
            word: "ما",
            correctOrder: ["م", "ا"],
            wrongOrder: ["ا", "م"],
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            hint: "پہلا حرف 'م' پھر 'ا'",
            meaning: "ہم"
        },
        
        // 3-letter words
        { 
            word: "بکری",
            correctOrder: ["ب", "ک", "ر", "ی"],
            wrongOrder: ["ی", "ر", "ک", "ب"],
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            hint: "دائیں سے بائیں: ب، ک، ر، ی",
            meaning: "جانور"
        },
        { 
            word: "شیر",
            correctOrder: ["ش", "ی", "ر"],
            wrongOrder: ["ر", "ی", "ش"],
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            hint: "دائیں سے بائیں: ش، ی، ر",
            meaning: "جنگل کا بادشاہ"
        },
        { 
            word: "کتاب",
            correctOrder: ["ک", "ت", "ا", "ب"],
            wrongOrder: ["ب", "ا", "ت", "ک"],
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "دائیں سے بائیں: ک، ت، ا، ب",
            meaning: "جس میں ہم پڑھتے ہیں"
        },
        { 
            word: "قلم",
            correctOrder: ["ق", "ل", "م"],
            wrongOrder: ["م", "ل", "ق"],
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            hint: "دائیں سے بائیں: ق، ل، م",
            meaning: "جس سے ہم لکھتے ہیں"
        },
        { 
            word: "گھر",
            correctOrder: ["گ", "ھ", "ر"],
            wrongOrder: ["ر", "ھ", "گ"],
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            hint: "دائیں سے بائیں: گ، ھ، ر",
            meaning: "جہاں ہم رہتے ہیں"
        },
        { 
            word: "پانی",
            correctOrder: ["پ", "ا", "ن", "ی"],
            wrongOrder: ["ی", "ن", "ا", "پ"],
            imageId: "14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-",
            hint: "دائیں سے بائیں: پ، ا، ن، ی",
            meaning: "جو ہم پیتے ہیں"
        },
        { 
            word: "دودھ",
            correctOrder: ["د", "و", "د", "ھ"],
            wrongOrder: ["ھ", "د", "و", "د"],
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            hint: "دائیں سے بائیں: د، و، د، ھ",
            meaning: "سفید رنگ کا مشروب"
        },
        { 
            word: "روٹی",
            correctOrder: ["ر", "و", "ٹ", "ی"],
            wrongOrder: ["ی", "ٹ", "و", "ر"],
            imageId: "1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1",
            hint: "دائیں سے بائیں: ر، و، ٹ، ی",
            meaning: "جو ہم کھاتے ہیں"
        },
        
        // 4-letter words
        { 
            word: "استاد",
            correctOrder: ["ا", "س", "ت", "ا", "د"],
            wrongOrder: ["د", "ا", "ت", "س", "ا"],
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            hint: "دائیں سے بائیں: ا، س، ت، ا، د",
            meaning: "جو ہمیں پڑھاتا ہے"
        },
        { 
            word: "سکول",
            correctOrder: ["س", "ک", "و", "ل"],
            wrongOrder: ["ل", "و", "ک", "س"],
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            hint: "دائیں سے بائیں: س، ک، و، ل",
            meaning: "جہاں ہم پڑھتے ہیں"
        },
        { 
            word: "گاڑی",
            correctOrder: ["گ", "ا", "ڑ", "ی"],
            wrongOrder: ["ی", "ڑ", "ا", "گ"],
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            hint: "دائیں سے بائیں: گ، ا، ڑ، ی",
            meaning: "جس پر ہم سفر کرتے ہیں"
        },
        { 
            word: "انار",
            correctOrder: ["ا", "ن", "ا", "ر"],
            wrongOrder: ["ر", "ا", "ن", "ا"],
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            hint: "دائیں سے بائیں: ا، ن، ا، ر",
            meaning: "سرخ رنگ کا پھل"
        },
        { 
            word: "انگور",
            correctOrder: ["ا", "ن", "گ", "و", "ر"],
            wrongOrder: ["ر", "و", "گ", "ن", "ا"],
            imageId: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6",
            hint: "دائیں سے بائیں: ا، ن، گ، و، ر",
            meaning: "چھوٹے میٹھے پھل"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    function showDirectionArrow() {
        const arrow = document.createElement('div');
        arrow.innerHTML = '➡️ ← 📝';
        arrow.style.cssText = 'position:fixed;top:30%;right:20px;background:#2563EB;color:white;padding:10px 15px;border-radius:50px;font-size:1rem;z-index:1000;animation:floatUp 2s forwards;pointer-events:none;';
        document.body.appendChild(arrow);
        setTimeout(() => arrow.remove(), 2000);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...wordsDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let selectedLetters = [];
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w200`;
        const wrongOrderDisplay = current.wrongOrder.join(' ');
        const totalSlots = current.correctOrder.length;
        
        // Create letter pool from wrong order
        const letterPool = shuffleArray([...current.wrongOrder]);
        selectedLetters = [];
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">➡️ سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">📖 اردو قاعدہ: دائیں سے بائیں جوڑیں 📖</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <img src="${imageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 20px; border: 2px solid white;"
                             onerror="this.src='https://via.placeholder.com/100x100/2563EB/white?text=${current.word}'">
                        <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 10px 20px;">
                            <div style="font-size: 0.8rem; color: #93C5FD;">معنی: ${current.meaning}</div>
                            <div style="font-size: 0.9rem; color: #FCD34D;">💡 ${current.hint}</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 12px; margin: 15px auto; max-width: 300px;">
                        <div style="font-size: 0.9rem; color: #FCD34D;">⚠️ غلط ترتیب (بائیں سے دائیں):</div>
                        <div style="font-size: 1.5rem; letter-spacing: 5px; margin-top: 5px;">${wrongOrderDisplay}</div>
                        <div style="font-size: 0.7rem; color: #93C5FD; margin-top: 5px;">← یہ غلط ہے! صحیح دائیں سے بائیں کریں →</div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">📝 حروف کو <span style="color:#F59E0B;">دائیں سے بائیں</span> صحیح ترتیب میں لگائیں</h3>
                
                <!-- Letter Pool -->
                <div id="letterPoolRTL" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0;"></div>
                
                <!-- Word Building Area (Right to Left) -->
                <div style="background: #E0E7FF; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #2563EB; margin-bottom: 10px;">🎯 صحیح ترتیب (دائیں سے بائیں - یہاں سے شروع کریں)</div>
                    <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; direction: rtl;" id="wordBuildRTL"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearRTLBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer;">🗑️ صاف کریں</button>
                    <button id="checkRTLBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevRTLBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextRTLBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate letter pool
        const letterPoolDiv = document.getElementById('letterPoolRTL');
        letterPool.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.style.cssText = 'width: 70px; height: 70px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 20px; font-size: 1.8rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2);';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(selectedLetters.length < totalSlots) {
                    selectedLetters.push(letter);
                    updateRTLDisplay(current.correctOrder);
                    btn.style.opacity = '0.5';
                    btn.style.pointerEvents = 'none';
                } else {
                    showToast('لفظ مکمل ہو چکا ہے! پہلے صاف کریں', 'info');
                }
            };
            letterPoolDiv.appendChild(btn);
        });
        
        function updateRTLDisplay(correctOrderArray) {
            const buildArea = document.getElementById('wordBuildRTL');
            buildArea.innerHTML = '';
            
            // Display in RTL order (right to left)
            for(let i = 0; i < totalSlots; i++) {
                const slot = document.createElement('div');
                const letter = selectedLetters[i] || '?';
                const isFilled = selectedLetters[i] !== undefined;
                
                slot.textContent = letter;
                slot.style.cssText = `
                    width: 70px;
                    height: 70px;
                    background: ${isFilled ? '#D1FAE5' : 'white'};
                    border: 2px solid ${isFilled ? '#10B981' : '#2563EB'};
                    border-radius: 15px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: ${isFilled ? '#059669' : '#9CA3AF'};
                    transition: all 0.2s;
                    margin: 0 2px;
                `;
                buildArea.appendChild(slot);
            }
        }
        
        // Initial display
        updateRTLDisplay(current.correctOrder);
        
        // Clear button
        document.getElementById('clearRTLBtn').onclick = () => {
            selectedLetters = [];
            updateRTLDisplay(current.correctOrder);
            document.querySelectorAll('#letterPoolRTL button').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            showToast('صاف کر دیا گیا! دوبارہ ترتیب دیں', 'info');
        };
        
        // Check button
        document.getElementById('checkRTLBtn').onclick = () => {
            // Check if all slots are filled
            if(selectedLetters.length !== totalSlots) {
                showToast(`براہ کرم تمام ${totalSlots} حروف منتخب کریں!`, 'error');
                return;
            }
            
            // Compare with correct order
            let isCorrect = true;
            for(let i = 0; i < totalSlots; i++) {
                if(selectedLetters[i] !== current.correctOrder[i]) {
                    isCorrect = false;
                    break;
                }
            }
            
            if(isCorrect) {
                score++;
                showClapping();
                playClapping();
                showDirectionArrow();
                showToast(`🎉 شاباش! "${current.word}" کو دائیں سے بائیں درست ترتیب دیا! 🎉`, 'success');
                
                // Disable inputs
                document.querySelectorAll('#letterPoolRTL button').forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                });
                document.getElementById('clearRTLBtn').style.pointerEvents = 'none';
                document.getElementById('checkRTLBtn').style.pointerEvents = 'none';
                
                // Highlight all slots green
                const slots = document.querySelectorAll('#wordBuildRTL div');
                slots.forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.color = 'white';
                });
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح ترتیب "${current.correctOrder.join('')}" ہے۔ دائیں سے بائیں دوبارہ لگائیں!`, 'error');
                
                // Highlight incorrect slots in red
                const slots = document.querySelectorAll('#wordBuildRTL div');
                for(let i = 0; i < totalSlots; i++) {
                    if(selectedLetters[i] !== current.correctOrder[i]) {
                        slots[i].style.background = '#FEE2E2';
                        slots[i].style.border = '2px solid #EF4444';
                        setTimeout(() => {
                            if(selectedLetters[i] !== undefined) {
                                slots[i].style.background = '#D1FAE5';
                                slots[i].style.border = '2px solid #10B981';
                            } else {
                                slots[i].style.background = 'white';
                                slots[i].style.border = '2px solid #2563EB';
                            }
                        }, 1000);
                    }
                }
            }
        };
        
        // Previous button
        document.getElementById('prevRTLBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextRTLBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب الفاظ دائیں سے بائیں درست ترتیب دیے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> الفاظ دائیں سے بائیں درست ترتیب دیے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod16Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod16Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','➡️'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 25: METHOD 17 - بغیر ملاوٹ والے حروف
// ========================================== */
// ========================================== */
// SECTION 25: METHOD 17 - بغیر ملاوٹ والے حروف
// (Non-Joining Letters - ا، د، ذ، ر، ز، و، ڈ، ڑ)
// یہ حروف صرف بائیں طرف سے جوڑتے ہیں، دائیں طرف سے نہیں
// 10-15 Random Questions | No Repeat
// ========================================== */

function method17_NoJoinLetters() {
    // ==========================================
    // NON-JOINING LETTERS DATABASE
    // These letters only join from left side, not from right
    // ا، د، ڈ، ذ، ر، ڑ، ز، و
    // ==========================================
    
    const nonJoinLettersDatabase = [
        { 
            letter: "ا",
            name: "الف",
            imageId: "1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "با (ب + ا)",
            exampleWord: "بابا",
            hint: "سب سے پہلا حرف، کھڑی لکیر"
        },
        { 
            letter: "د",
            name: "دال",
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بد (ب + د)",
            exampleWord: "دودھ",
            hint: "گول شکل، نقطہ نہیں"
        },
        { 
            letter: "ڈ",
            name: "ڈال",
            imageId: "1jURVEHdhuGb_0nAzamP_wo_XddrxuK31",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بڈ (ب + ڈ)",
            exampleWord: "ڈبہ",
            hint: "د کی طرح لیکن اوپر طش ہے"
        },
        { 
            letter: "ذ",
            name: "ذال",
            imageId: "1hwrD0S25T8i-uPeFQ2jZ6Ej2JOPIsmLk",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بذ (ب + ذ)",
            exampleWord: "ذہین",
            hint: "ایک نقطہ اوپر"
        },
        { 
            letter: "ر",
            name: "رے",
            imageId: "1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بر (ب + ر)",
            exampleWord: "روٹی",
            hint: "پتلی گول شکل"
        },
        { 
            letter: "ڑ",
            name: "ڑے",
            imageId: "1nPMjNdxAxeQxl84UOtLhZsbDm8K1YLhw",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بڑ (ب + ڑ)",
            exampleWord: "بڑا",
            hint: "ر کی طرح لیکن اوپر طش ہے"
        },
        { 
            letter: "ز",
            name: "زے",
            imageId: "1Yia5WCaxAEiZ0TeYTbMkqTkPvTs91fK-",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بز (ب + ز)",
            exampleWord: "زمین",
            hint: "ایک نقطہ اوپر"
        },
        { 
            letter: "و",
            name: "واؤ",
            imageId: "1nLc0dnqvPOE0tvo2LUMGkd1K9bTx-PWU",
            rule: "یہ حرف صرف بائیں طرف سے جوڑتا ہے، دائیں طرف سے نہیں",
            example: "بو (ب + و)",
            exampleWord: "والد",
            hint: "گول شکل، نقطہ نہیں"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...nonJoinLettersDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctLetter) {
        const allLetters = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی', 'ے'];
        let options = [correctLetter];
        
        // Add other non-joining letters as options
        const nonJoinLetters = ['ا', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'و'];
        const otherNonJoin = nonJoinLetters.filter(l => l !== correctLetter);
        
        while(options.length < 4 && otherNonJoin.length > 0) {
            const randomLetter = otherNonJoin[Math.floor(Math.random() * otherNonJoin.length)];
            if(!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        
        // If still need more, add random letters
        while(options.length < 4) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w200`;
        const options = generateOptions(current.letter);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px;">
                <div class="question-counter">🚫 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🚫 بغیر ملاوٹ والے حروف (Non-Joining Letters) 🚫</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <img src="${imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 20px; border: 2px solid white;"
                                 onerror="this.src='https://via.placeholder.com/120x120/2563EB/white?text=${current.letter}'">
                            <div style="margin-top: 10px; font-size: 3rem; background: rgba(255,255,255,0.2); border-radius: 15px; padding: 10px; display: inline-block;">
                                ${current.letter}
                            </div>
                        </div>
                        <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 15px; max-width: 300px;">
                            <div style="font-size: 0.8rem; color: #93C5FD;">📖 قاعدہ</div>
                            <div style="font-size: 0.9rem; color: #FCD34D; margin: 5px 0;">${current.rule}</div>
                            <div style="font-size: 0.8rem; color: #93C5FD; margin-top: 10px;">💡 مثال: ${current.example}</div>
                            <div style="font-size: 0.8rem; color: #93C5FD;">📝 لفظ: ${current.exampleWord}</div>
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0;">❓ یہ کون سا حرف ہے جو <span style="color:#F59E0B;">دائیں طرف سے جوڑ نہیں بناتا</span>؟</h3>
                
                <div id="noJoinOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 400px; margin: 20px auto;"></div>
                
                <div style="background: #FEF3C7; border-radius: 20px; padding: 15px; margin: 15px auto; max-width: 350px;">
                    <div style="font-size: 0.9rem; color: #D97706;">💡 یاد رکھیں:</div>
                    <div style="font-size: 0.8rem; color: #92400E;">یہ حروف صرف <strong>بائیں طرف</strong> سے جوڑتے ہیں، <strong>دائیں طرف</strong> سے نہیں</div>
                    <div style="font-size: 1.2rem; margin-top: 10px;">ا، د، ڈ، ذ، ر، ڑ، ز، و</div>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevNoJoinBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">◀ پچھلا</button>
                    <button id="nextNoJoinBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('noJoinOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2.5rem;">${opt}</div><div style="font-size: 0.7rem;">حرف</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer; transition: all 0.2s; text-align: center;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === current.letter) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${current.name}" حرف دائیں طرف سے جوڑ نہیں بناتا! 🎉`, 'success');
                    
                    document.querySelectorAll('#noJoinOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    // Check if the wrong answer is a non-joining letter
                    const isNonJoin = ['ا', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'و'].includes(opt);
                    if(isNonJoin) {
                        showToast(`❌ غلط! "${current.name}" صحیح ہے۔ ${opt} بھی بغیر ملاوٹ ہے لیکن یہ ${current.name} ہے۔ دوبارہ دیکھیں!`, 'error');
                    } else {
                        showToast(`❌ غلط! "${opt}" تو جوڑ بناتا ہے۔ صحیح حرف "${current.name}" ہے جو دائیں طرف سے جوڑ نہیں بناتا!`, 'error');
                    }
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevNoJoinBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextNoJoinBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب بغیر ملاوٹ والے حروف پہچان لیے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> بغیر ملاوٹ والے حروف درست پہچانے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <div style="background: #FEF3C7; border-radius: 15px; padding: 15px; margin: 15px 0;">
                    <div style="font-size: 1rem; color: #D97706;">📝 یاد رکھیں:</div>
                    <div style="font-size: 1.2rem; letter-spacing: 5px;">ا، د، ڈ، ذ، ر، ڑ، ز، و</div>
                    <div style="font-size: 0.8rem; color: #92400E;">یہ حروف صرف بائیں طرف سے جوڑتے ہیں!</div>
                </div>
                <button id="finishMethod17Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod17Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🚫'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 26: METHOD 18 - مکمل ملاوٹ والے حروف
// ========================================== */
// ========================================== */
// SECTION 26: METHOD 18 - مکمل ملاوٹ والے حروف
// (Fully Joining Letters - ب، پ، ت، ٹ، ج، چ، ح، خ، س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ک، گ، ل، م، ن، ہ، ی)
// یہ حروف دونوں طرف سے جوڑ بناتے ہیں
// 15-20 Random Questions | No Repeat
// ========================================== */

// ========================================== */
// SECTION 26: METHOD 18 - مکمل ملاوٹ والے حروف
// (Fully Joining Letters - ب، پ، ت، ٹ، ج، چ، ح، خ، س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ک، گ، ل، م، ن، ہ، ی)
// یہ حروف دونوں طرف سے جوڑ بناتے ہیں
// Font: Jameel Noori Nastaleeq
// 15-20 Random Questions | No Repeat
// ========================================== */

function method18_FullJoinLetters() {
    // ==========================================
    // FULLY JOINING LETTERS DATABASE - CORRECTED
    // Each letter has correct forms and matching images
    // ==========================================
    
    const fullJoinLettersDatabase = [
        // Group 1: Bay family (ب، پ، ت، ٹ)
        { 
            letter: "ب",
            name: "بے",
            isolated: "ب",
            initialForm: "بـ",
            medialForm: "ـبـ",
            finalForm: "ـب",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین نقطے نیچے",
            example: "بابا",
            hint: "تین نقطے نیچے"
        },
        { 
            letter: "پ",
            name: "پے",
            isolated: "پ",
            initialForm: "پـ",
            medialForm: "ـپـ",
            finalForm: "ـپ",
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین نقطے اوپر",
            example: "پاپا",
            hint: "تین نقطے اوپر"
        },
        { 
            letter: "ت",
            name: "تے",
            isolated: "ت",
            initialForm: "تـ",
            medialForm: "ـتـ",
            finalForm: "ـت",
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - دو نقطے اوپر",
            example: "توتا",
            hint: "دو نقطے اوپر"
        },
        { 
            letter: "ٹ",
            name: "ٹے",
            isolated: "ٹ",
            initialForm: "ٹـ",
            medialForm: "ـٹـ",
            finalForm: "ـٹ",
            imageId: "1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - طش کے ساتھ",
            example: "ٹوٹی",
            hint: "طش اوپر"
        },
        
        // Group 2: Jeem family (ج، چ، ح، خ)
        { 
            letter: "ج",
            name: "جیم",
            isolated: "ج",
            initialForm: "جـ",
            medialForm: "ـجـ",
            finalForm: "ـج",
            imageId: "1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ نیچے",
            example: "جاجا",
            hint: "ایک نقطہ نیچے"
        },
        { 
            letter: "چ",
            name: "چے",
            isolated: "چ",
            initialForm: "چـ",
            medialForm: "ـچـ",
            finalForm: "ـچ",
            imageId: "1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین نقطے نیچے",
            example: "چاچا",
            hint: "تین نقطے نیچے"
        },
        { 
            letter: "ح",
            name: "حے",
            isolated: "ح",
            initialForm: "حـ",
            medialForm: "ـحـ",
            finalForm: "ـح",
            imageId: "1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - بغیر نقطے",
            example: "حاحا",
            hint: "کھلی ہوئی شکل"
        },
        { 
            letter: "خ",
            name: "خے",
            isolated: "خ",
            initialForm: "خـ",
            medialForm: "ـخـ",
            finalForm: "ـخ",
            imageId: "1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "خاخا",
            hint: "ایک نقطہ اوپر"
        },
        
        // Group 3: Seen family (س، ش، ص، ض)
        { 
            letter: "س",
            name: "سین",
            isolated: "س",
            initialForm: "سـ",
            medialForm: "ـسـ",
            finalForm: "ـس",
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین دانت",
            example: "ساسا",
            hint: "تین دانت"
        },
        { 
            letter: "ش",
            name: "شین",
            isolated: "ش",
            initialForm: "شـ",
            medialForm: "ـشـ",
            finalForm: "ـش",
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین نقطے اوپر",
            example: "شاشا",
            hint: "تین نقطے اوپر"
        },
        { 
            letter: "ص",
            name: "صاد",
            isolated: "ص",
            initialForm: "صـ",
            medialForm: "ـصـ",
            finalForm: "ـص",
            imageId: "18pQ2i_5GQoDh2RnMg9_xTNrkanAUT5NB",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - گول شکل",
            example: "صاصا",
            hint: "گول، بغیر نقطے"
        },
        { 
            letter: "ض",
            name: "ضاد",
            isolated: "ض",
            initialForm: "ضـ",
            medialForm: "ـضـ",
            finalForm: "ـض",
            imageId: "1OQ0Wc6lLOpCt5N6f2VZgCobT3KhlNZTe",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "ضاضا",
            hint: "ایک نقطہ اوپر"
        },
        
        // Group 4: Toe family (ط، ظ، ع، غ)
        { 
            letter: "ط",
            name: "طوئے",
            isolated: "ط",
            initialForm: "طـ",
            medialForm: "ـطـ",
            finalForm: "ـط",
            imageId: "1Usyaszm_W_F0-nGPIcMJYawDGzj2wTkL",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - بغیر نقطے",
            example: "طاطا",
            hint: "گول، چھوٹی"
        },
        { 
            letter: "ظ",
            name: "ظوئے",
            isolated: "ظ",
            initialForm: "ظـ",
            medialForm: "ـظـ",
            finalForm: "ـظ",
            imageId: "1OULQpu0kA8aUZCcs3kImlHTF38dNrAWM",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "ظاظا",
            hint: "ایک نقطہ اوپر"
        },
        { 
            letter: "ع",
            name: "عین",
            isolated: "ع",
            initialForm: "عـ",
            medialForm: "ـعـ",
            finalForm: "ـع",
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - بغیر نقطے",
            example: "عاعا",
            hint: "کھلی ہوئی آنکھ"
        },
        { 
            letter: "غ",
            name: "غین",
            isolated: "غ",
            initialForm: "غـ",
            medialForm: "ـغـ",
            finalForm: "ـغ",
            imageId: "1nkstxswRZj9FHTluYVQGzeg5X10_CLgH",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "غاغا",
            hint: "ایک نقطہ اوپر"
        },
        
        // Group 5: Kaaf family (ف، ق، ک، گ)
        { 
            letter: "ف",
            name: "فے",
            isolated: "ف",
            initialForm: "فـ",
            medialForm: "ـفـ",
            finalForm: "ـف",
            imageId: "1SEyOHC_Z7RNwwDejAl-CZj5o95eeERnk",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "فافا",
            hint: "ایک نقطہ اوپر، گول"
        },
        { 
            letter: "ق",
            name: "قاف",
            isolated: "ق",
            initialForm: "قـ",
            medialForm: "ـقـ",
            finalForm: "ـق",
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - دو نقطے اوپر",
            example: "قاقا",
            hint: "دو نقطے اوپر"
        },
        { 
            letter: "ک",
            name: "کاف",
            isolated: "ک",
            initialForm: "کـ",
            medialForm: "ـکـ",
            finalForm: "ـک",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - دو خط",
            example: "کاکا",
            hint: "دو خط"
        },
        { 
            letter: "گ",
            name: "گاف",
            isolated: "گ",
            initialForm: "گـ",
            medialForm: "ـگـ",
            finalForm: "ـگ",
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - تین خط",
            example: "گاگا",
            hint: "تین خط"
        },
        
        // Group 6: Laam, Meem, Noon, Hey, Yeh (ل، م، ن، ہ، ی)
        { 
            letter: "ل",
            name: "لام",
            isolated: "ل",
            initialForm: "لـ",
            medialForm: "ـلـ",
            finalForm: "ـل",
            imageId: "1bftsVJJujHe_5pgAavymJqusHreg8Tb8",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - لمبا",
            example: "لالا",
            hint: "لمبا کھڑا"
        },
        { 
            letter: "م",
            name: "میم",
            isolated: "م",
            initialForm: "مـ",
            medialForm: "ـمـ",
            finalForm: "ـم",
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - گول",
            example: "ماما",
            hint: "گول شکل"
        },
        { 
            letter: "ن",
            name: "نون",
            isolated: "ن",
            initialForm: "نـ",
            medialForm: "ـنـ",
            finalForm: "ـن",
            imageId: "1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - ایک نقطہ اوپر",
            example: "نانا",
            hint: "ایک نقطہ اوپر"
        },
        { 
            letter: "ہ",
            name: "ہے",
            isolated: "ہ",
            initialForm: "ہـ",
            medialForm: "ـہـ",
            finalForm: "ـہ",
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - دو آنکھ",
            example: "ہاہا",
            hint: "دو آنکھ"
        },
        { 
            letter: "ی",
            name: "یے",
            isolated: "ی",
            initialForm: "یـ",
            medialForm: "ـیـ",
            finalForm: "ـی",
            imageId: "1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_",
            rule: "یہ حرف دونوں طرف سے جوڑ بناتا ہے - دو نقطے نیچے",
            example: "یایا",
            hint: "دو نقطے نیچے"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Define question types
    const questionTypes = [
        { type: 'initial', question: 'اس حرف کی "ابتدائی" شکل کون سی ہے؟', formField: 'initialForm', displayName: 'ابتدائی' },
        { type: 'medial', question: 'اس حرف کی "وسطی" شکل کون سی ہے؟', formField: 'medialForm', displayName: 'وسطی' },
        { type: 'final', question: 'اس حرف کی "آخری" شکل کون سی ہے؟', formField: 'finalForm', displayName: 'آخری' },
        { type: 'isolated', question: 'اس حرف کی "الگ" شکل کون سی ہے؟', formField: 'isolated', displayName: 'الگ' }
    ];
    
    // Get random questions (15-20, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const questions = [];
        const usedLetters = new Set();
        
        while(questions.length < totalQuestions && usedLetters.size < fullJoinLettersDatabase.length) {
            const randomLetter = fullJoinLettersDatabase[Math.floor(Math.random() * fullJoinLettersDatabase.length)];
            const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const questionKey = `${randomLetter.letter}_${randomType.type}`;
            
            if(!usedLetters.has(questionKey)) {
                usedLetters.add(questionKey);
                questions.push({
                    letterData: randomLetter,
                    questionType: randomType
                });
            }
        }
        
        return questions;
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    
    function generateOptions(correctForm, letterData) {
        // Get all forms from other fully joining letters
        const allForms = [];
        fullJoinLettersDatabase.forEach(l => {
            allForms.push(l.initialForm, l.medialForm, l.finalForm, l.isolated);
        });
        
        let options = [correctForm];
        while(options.length < 4) {
            const randomForm = allForms[Math.floor(Math.random() * allForms.length)];
            if(!options.includes(randomForm) && randomForm !== '' && randomForm !== correctForm) {
                options.push(randomForm);
            }
        }
        return shuffleArray(options);
    }
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const letterData = current.letterData;
        const questionType = current.questionType;
        const correctForm = letterData[questionType.formField];
        const imageUrl = `https://drive.google.com/thumbnail?id=${letterData.imageId}&sz=w200`;
        const options = generateOptions(correctForm, letterData);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">
                <div class="question-counter" style="font-family: 'Jameel Noori Nastaleeq', serif;">🔗 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🔗 مکمل ملاوٹ والے حروف (Fully Joining Letters) 🔗</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <img src="${imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 20px; border: 2px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"
                                 onerror="this.src='https://via.placeholder.com/120x120/2563EB/white?text=${letterData.letter}'">
                            <div style="margin-top: 10px; font-size: 3rem; background: rgba(255,255,255,0.2); border-radius: 15px; padding: 10px 20px; display: inline-block; font-family: 'Jameel Noori Nastaleeq', serif;">
                                ${letterData.letter}
                            </div>
                            <div style="margin-top: 5px; font-size: 0.8rem; color: #93C5FD;">${letterData.name}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 15px; max-width: 300px;">
                            <div style="font-size: 0.8rem; color: #93C5FD;">📖 قاعدہ</div>
                            <div style="font-size: 0.9rem; color: #FCD34D; margin: 5px 0;">${letterData.rule}</div>
                            <div style="font-size: 0.8rem; color: #93C5FD; margin-top: 10px;">💡 مثال: ${letterData.example}</div>
                            <div style="font-size: 0.8rem; color: #93C5FD;">💡 اشارہ: ${letterData.hint}</div>
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0; font-family: 'Jameel Noori Nastaleeq', serif;">❓ ${questionType.question}</h3>
                
                <div id="fullJoinOptions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 500px; margin: 20px auto;"></div>
                
                <div style="background: #D1FAE5; border-radius: 20px; padding: 15px; margin: 15px auto; max-width: 350px;">
                    <div style="font-size: 0.9rem; color: #059669;">💡 یاد رکھیں:</div>
                    <div style="font-size: 0.8rem; color: #047857;">یہ حروف <strong>دونوں طرف سے</strong> جوڑ بناتے ہیں (دائیں اور بائیں)</div>
                    <div style="font-size: 1rem; letter-spacing: 2px; margin-top: 8px; color: #065F46;">ب، پ، ت، ٹ، ج، چ، ح، خ، س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ک، گ، ل، م، ن، ہ، ی</div>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevFullJoinBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">◀ پچھلا</button>
                    <button id="nextFullJoinBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        const optionsContainer = document.getElementById('fullJoinOptions');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerHTML = `<div style="font-size: 2rem; font-family: 'Jameel Noori Nastaleeq', serif;">${opt}</div>`;
            btn.style.cssText = 'background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; border-radius: 20px; padding: 20px 10px; cursor: pointer; transition: all 0.2s; text-align: center; min-width: 100px;';
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            
            btn.onclick = () => {
                if(opt === correctForm) {
                    score++;
                    showClapping();
                    playClapping();
                    showToast(`🎉 شاباش! "${letterData.name}" کی ${questionType.displayName} شکل درست پہچانی! 🎉`, 'success');
                    
                    document.querySelectorAll('#fullJoinOptions button').forEach(b => {
                        b.style.pointerEvents = 'none';
                        b.style.opacity = '0.7';
                    });
                    
                    btn.style.background = '#10B981';
                    btn.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if(currentIndex + 1 < totalQuestions) {
                            currentIndex++;
                            renderQuestion();
                        } else {
                            finishQuiz();
                        }
                    }, 1200);
                } else {
                    showThumbDown();
                    showToast(`❌ غلط! صحیح شکل "${correctForm}" ہے۔ دوبارہ دیکھیں!`, 'error');
                    
                    btn.style.background = '#EF4444';
                    btn.style.animation = 'shake 0.3s';
                    setTimeout(() => {
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                        btn.style.animation = '';
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
        
        // Previous button
        document.getElementById('prevFullJoinBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button
        document.getElementById('nextFullJoinBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب مکمل ملاوٹ والے حروف کی شکلیں پہچان لیں! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> مکمل ملاوٹ والے حروف کی شکلیں درست پہچانیں</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <div style="background: #D1FAE5; border-radius: 15px; padding: 15px; margin: 15px 0;">
                    <div style="font-size: 1rem; color: #059669;">📝 یاد رکھیں:</div>
                    <div style="font-size: 1.2rem; letter-spacing: 3px; font-family: 'Jameel Noori Nastaleeq', serif;">ب، پ، ت، ٹ، ج، چ، ح، خ، س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ک، گ، ل، م، ن، ہ، ی</div>
                    <div style="font-size: 0.8rem; color: #047857;">یہ ${fullJoinLettersDatabase.length} حروف دونوں طرف سے جوڑ بناتے ہیں!</div>
                </div>
                <button id="finishMethod18Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod18Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🔗'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 27: METHOD 19 - ڈریگ اینڈ ڈراپ
// ========================================== */
// ========================================== */
// SECTION 27: METHOD 19 - ڈریگ اینڈ ڈراپ
// (Drag and Drop - Build Words by Dragging Letters)
// حروف کو گھسیٹ کر صحیح جگہ پر رکھیں
// فونٹ: جمیل نوری نستعلیق
// 10-15 Random Questions | No Repeat
// ========================================== */

function method19_DragDrop() {
    // ==========================================
    // WORDS DATABASE for Drag and Drop Game
    // Each word has letters that need to be dragged to correct positions
    // ==========================================
    
    const wordsDatabase = [
        // 2-letter words
        { 
            word: "با",
            letters: ["ب", "ا"],
            imageId: "1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX",
            hint: "پہلا حرف 'ب' پھر 'ا'",
            meaning: "کے ساتھ"
        },
        { 
            word: "تا",
            letters: ["ت", "ا"],
            imageId: "1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO",
            hint: "پہلا حرف 'ت' پھر 'ا'",
            meaning: "تک"
        },
        { 
            word: "پا",
            letters: ["پ", "ا"],
            imageId: "1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc",
            hint: "پہلا حرف 'پ' پھر 'ا'",
            meaning: "پاؤں"
        },
        
        // 3-letter words
        { 
            word: "بکری",
            letters: ["ب", "ک", "ر", "ی"],
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            hint: "دودھ دینے والی",
            meaning: "جانور"
        },
        { 
            word: "شیر",
            letters: ["ش", "ی", "ر"],
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            hint: "جنگل کا بادشاہ",
            meaning: "جانور"
        },
        { 
            word: "کتاب",
            letters: ["ک", "ت", "ا", "ب"],
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "جس میں ہم پڑھتے ہیں",
            meaning: "چیز"
        },
        { 
            word: "قلم",
            letters: ["ق", "ل", "م"],
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            hint: "جس سے ہم لکھتے ہیں",
            meaning: "چیز"
        },
        { 
            word: "گھر",
            letters: ["گ", "ھ", "ر"],
            imageId: "1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu",
            hint: "جہاں ہم رہتے ہیں",
            meaning: "چیز"
        },
        { 
            word: "پانی",
            letters: ["پ", "ا", "ن", "ی"],
            imageId: "14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-",
            hint: "جو ہم پیتے ہیں",
            meaning: "مشروب"
        },
        { 
            word: "دودھ",
            letters: ["د", "و", "د", "ھ"],
            imageId: "1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3",
            hint: "سفید رنگ کا مشروب",
            meaning: "مشروب"
        },
        { 
            word: "روٹی",
            letters: ["ر", "و", "ٹ", "ی"],
            imageId: "1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1",
            hint: "جو ہم کھاتے ہیں",
            meaning: "خوراک"
        },
        { 
            word: "انار",
            letters: ["ا", "ن", "ا", "ر"],
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            hint: "سرخ رنگ کا پھل",
            meaning: "پھل"
        },
        { 
            word: "آم",
            letters: ["آ", "م"],
            imageId: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF",
            hint: "بادشاہ پھل",
            meaning: "پھل"
        },
        { 
            word: "انگور",
            letters: ["ا", "ن", "گ", "و", "ر"],
            imageId: "1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6",
            hint: "چھوٹے میٹھے پھل",
            meaning: "پھل"
        },
        
        // 4-letter words
        { 
            word: "استاد",
            letters: ["ا", "س", "ت", "ا", "د"],
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            hint: "جو ہمیں پڑھاتا ہے",
            meaning: "شخص"
        },
        { 
            word: "سکول",
            letters: ["س", "ک", "و", "ل"],
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            hint: "جہاں ہم پڑھتے ہیں",
            meaning: "مقام"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...wordsDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let droppedLetters = [];
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const wordLetters = current.letters;
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w200`;
        
        // Create letter pool (shuffled letters of the word)
        const letterPool = shuffleArray([...wordLetters]);
        droppedLetters = new Array(wordLetters.length).fill('');
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">
                <div class="question-counter" style="font-family: 'Jameel Noori Nastaleeq', serif;">🖱️ سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🖱️ حروف کو گھسیٹ کر صحیح جگہ پر رکھیں 🖱️</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                        <img src="${imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 20px; border: 2px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"
                             onerror="this.src='https://via.placeholder.com/120x120/2563EB/white?text=${current.word}'">
                        <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 15px;">
                            <div style="font-size: 0.8rem; color: #93C5FD;">💡 ${current.hint}</div>
                            <div style="font-size: 0.8rem; color: #93C5FD; margin-top: 5px;">📖 معنی: ${current.meaning}</div>
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0; font-family: 'Jameel Noori Nastaleeq', serif;">📝 حروف کو صحیح ترتیب میں لگائیں</h3>
                
                <!-- Drag Source Area (Letters to drag) -->
                <div style="background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 10px;">📦 یہاں سے حروف کو گھسیٹیں</div>
                    <div id="dragSourceArea" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"></div>
                </div>
                
                <!-- Drop Area (Where to drop letters) -->
                <div style="background: #E0E7FF; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;">
                    <div style="font-size: 0.8rem; color: #2563EB; margin-bottom: 10px;">🎯 حروف کو یہاں ڈراپ کریں</div>
                    <div id="dropArea" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearDragBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">🗑️ صاف کریں</button>
                    <button id="checkDragBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevDragBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">◀ پچھلا</button>
                    <button id="nextDragBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate drag source area
        const sourceArea = document.getElementById('dragSourceArea');
        letterPool.forEach((letter, idx) => {
            const dragItem = document.createElement('div');
            dragItem.textContent = letter;
            dragItem.setAttribute('data-letter', letter);
            dragItem.setAttribute('data-idx', idx);
            dragItem.style.cssText = `
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                border-radius: 15px;
                cursor: grab;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                transition: all 0.2s;
                font-family: 'Jameel Noori Nastaleeq', serif;
            `;
            dragItem.onmouseenter = () => dragItem.style.transform = 'scale(1.05)';
            dragItem.onmouseleave = () => dragItem.style.transform = 'scale(1)';
            dragItem.draggable = true;
            dragItem.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    letter: letter,
                    sourceIdx: idx
                }));
            };
            sourceArea.appendChild(dragItem);
        });
        
        // Populate drop area (empty slots)
        const dropArea = document.getElementById('dropArea');
        for(let i = 0; i < wordLetters.length; i++) {
            const dropSlot = document.createElement('div');
            dropSlot.setAttribute('data-slot-index', i);
            dropSlot.style.cssText = `
                width: 80px;
                height: 80px;
                border: 2px dashed #2563EB;
                border-radius: 15px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: white;
                font-size: 1.8rem;
                color: #9CA3AF;
                transition: all 0.2s;
                font-family: 'Jameel Noori Nastaleeq', serif;
            `;
            dropSlot.innerHTML = `<span style="font-size: 0.7rem;">?</span>`;
            
            dropSlot.ondragover = (e) => e.preventDefault();
            dropSlot.ondrop = (e) => {
                e.preventDefault();
                const slotIndex = parseInt(dropSlot.getAttribute('data-slot-index'));
                
                // If slot already filled, don't allow drop
                if(droppedLetters[slotIndex] !== '') {
                    showToast('یہ جگہ پہلے سے بھری ہوئی ہے!', 'info');
                    return;
                }
                
                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const letter = dragData.letter;
                
                // Find the dragged element and remove it
                const draggedElement = document.querySelector(`#dragSourceArea div[data-letter="${letter}"][data-idx="${dragData.sourceIdx}"]`);
                if(draggedElement) {
                    draggedElement.remove();
                }
                
                // Fill the slot
                droppedLetters[slotIndex] = letter;
                dropSlot.innerHTML = letter;
                dropSlot.style.background = '#D1FAE5';
                dropSlot.style.border = '2px solid #10B981';
                dropSlot.style.color = '#059669';
                
                // Check if all slots are filled
                if(!droppedLetters.includes('')) {
                    // Auto-check when all letters are placed
                    setTimeout(() => {
                        document.getElementById('checkDragBtn').click();
                    }, 500);
                }
            };
            dropArea.appendChild(dropSlot);
        }
        
        // Clear button functionality
        document.getElementById('clearDragBtn').onclick = () => {
            // Reset dropped letters
            droppedLetters = new Array(wordLetters.length).fill('');
            
            // Clear all drop slots
            const dropSlots = document.querySelectorAll('#dropArea div');
            dropSlots.forEach((slot, idx) => {
                slot.innerHTML = `<span style="font-size: 0.7rem;">?</span>`;
                slot.style.background = 'white';
                slot.style.border = '2px dashed #2563EB';
                slot.style.color = '#9CA3AF';
            });
            
            // Rebuild source area with all original letters
            const sourceArea = document.getElementById('dragSourceArea');
            sourceArea.innerHTML = '';
            const newLetterPool = shuffleArray([...wordLetters]);
            newLetterPool.forEach((letter, idx) => {
                const dragItem = document.createElement('div');
                dragItem.textContent = letter;
                dragItem.setAttribute('data-letter', letter);
                dragItem.setAttribute('data-idx', idx);
                dragItem.style.cssText = `
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    border-radius: 15px;
                    cursor: grab;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                    font-family: 'Jameel Noori Nastaleeq', serif;
                `;
                dragItem.onmouseenter = () => dragItem.style.transform = 'scale(1.05)';
                dragItem.onmouseleave = () => dragItem.style.transform = 'scale(1)';
                dragItem.draggable = true;
                dragItem.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        letter: letter,
                        sourceIdx: idx
                    }));
                };
                sourceArea.appendChild(dragItem);
            });
            
            showToast('صاف کر دیا گیا! دوبارہ ترتیب دیں', 'info');
        };
        
        // Check button functionality
        document.getElementById('checkDragBtn').onclick = () => {
            // Check if all slots are filled
            if(droppedLetters.includes('')) {
                showToast(`براہ کرم تمام ${wordLetters.length} حروف ڈراپ کریں!`, 'error');
                return;
            }
            
            // Compare with correct word
            const userWord = droppedLetters.join('');
            const correctWord = wordLetters.join('');
            
            if(userWord === correctWord) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! "${current.word}" لفظ درست بنایا! 🎉`, 'success');
                
                // Disable all drag items
                document.querySelectorAll('#dragSourceArea div').forEach(item => {
                    item.draggable = false;
                    item.style.opacity = '0.5';
                    item.style.cursor = 'default';
                });
                
                // Disable drop slots
                document.querySelectorAll('#dropArea div').forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.border = '2px solid #10B981';
                    slot.style.color = 'white';
                    slot.ondragover = null;
                    slot.ondrop = null;
                });
                
                document.getElementById('clearDragBtn').style.pointerEvents = 'none';
                document.getElementById('checkDragBtn').style.pointerEvents = 'none';
                document.getElementById('clearDragBtn').style.opacity = '0.5';
                document.getElementById('checkDragBtn').style.opacity = '0.5';
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح لفظ "${current.word}" ہے۔ دوبارہ ترتیب دیں!`, 'error');
                
                // Highlight incorrect slots in red
                const dropSlots = document.querySelectorAll('#dropArea div');
                for(let i = 0; i < wordLetters.length; i++) {
                    if(droppedLetters[i] !== wordLetters[i]) {
                        dropSlots[i].style.background = '#FEE2E2';
                        dropSlots[i].style.border = '2px solid #EF4444';
                        setTimeout(() => {
                            if(droppedLetters[i] !== '') {
                                dropSlots[i].style.background = '#D1FAE5';
                                dropSlots[i].style.border = '2px solid #10B981';
                            } else {
                                dropSlots[i].style.background = 'white';
                                dropSlots[i].style.border = '2px dashed #2563EB';
                            }
                        }, 1000);
                    }
                }
            }
        };
        
        // Previous button
        document.getElementById('prevDragBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextDragBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب الفاظ درست بنائے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> الفاظ درست بنائے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod19Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod19Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🖱️'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 28: METHOD 21 - پزل
// ========================================== */
// ========================================== */
// SECTION 28: METHOD 21 - پزل کے ذریعے
// (Puzzle - Complete the Picture by Answering Questions)
// ہر صحیح جواب پر تصویر کا ایک ٹکڑا کھلے گا
// 8-12 Random Questions | No Repeat
// Font: Jameel Noori Nastaleeq
// ========================================== */

// ========================================== */
// SECTION 28: METHOD 21 - پزل کے ذریعے
// (Picture Puzzle - Complete the Image by Dragging Pieces)
// تصویر کو پزل ٹکڑوں سے مکمل کریں
// 1 Picture Puzzle per session | Drag and drop pieces
// Font: Jameel Noori Nastaleeq
// ========================================== */

function method21_Puzzle() {
    // ==========================================
    // PUZZLE IMAGES DATABASE
    // Each puzzle has a complete image broken into 9 pieces
    // ==========================================
    
    const puzzleImages = [
        {
            id: 1,
            name: "بکری",
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            category: "جانور",
            hint: "دودھ دینے والی جانور",
            funFact: "بکری روزانہ 2-3 لیٹر دودھ دیتی ہے"
        },
        {
            id: 2,
            name: "شیر",
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            category: "جانور",
            hint: "جنگل کا بادشاہ",
            funFact: "شیر دن میں 20 گھنٹے سوتا ہے"
        },
        {
            id: 3,
            name: "ہاتھی",
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            category: "جانور",
            hint: "بہت بڑا جانور",
            funFact: "ہاتھی پانی بہت پسند کرتا ہے"
        },
        {
            id: 4,
            name: "اونٹ",
            imageId: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz",
            category: "جانور",
            hint: "صحرا کا جانور",
            funFact: "اونٹ کئی دن بغیر پانی کے رہ سکتا ہے"
        },
        {
            id: 5,
            name: "انار",
            imageId: "1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk",
            category: "پھل",
            hint: "سرخ رنگ کا پھل",
            funFact: "انار میں بہت سے دانے ہوتے ہیں"
        },
        {
            id: 6,
            name: "آم",
            imageId: "1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF",
            category: "پھل",
            hint: "بادشاہ پھل",
            funFact: "آم کو پھلوں کا بادشاہ کہا جاتا ہے"
        },
        {
            id: 7,
            name: "کتاب",
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            category: "چیز",
            hint: "جس میں ہم پڑھتے ہیں",
            funFact: "کتاب ہماری بہترین دوست ہے"
        },
        {
            id: 8,
            name: "قلم",
            imageId: "1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ",
            category: "چیز",
            hint: "جس سے ہم لکھتے ہیں",
            funFact: "قلم سے علم پھیلتا ہے"
        },
        {
            id: 9,
            name: "پنکھا",
            imageId: "1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz",
            category: "چیز",
            hint: "ہوا کرنے والا",
            funFact: "پنکھا گرمی میں ٹھنڈک دیتا ہے"
        },
        {
            id: 10,
            name: "توتا",
            imageId: "1YZVTb7qY6er014J5n6DhepBqX3Mu011c",
            category: "پرندہ",
            hint: "سبز رنگ کا پرندہ",
            funFact: "توتا بولنا سیکھ سکتا ہے"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function playSuccessSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.2;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.5);
            osc.stop(now + 0.5);
        } catch(e) {}
    }
    
    // Select random puzzle from database
    let currentPuzzle = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    let pieces = [];
    let gridSize = 3; // 3x3 grid = 9 pieces
    let placedPieces = 0;
    let puzzleCompleted = false;
    
    // Create puzzle pieces
    function createPuzzlePieces() {
        pieces = [];
        for(let i = 0; i < gridSize * gridSize; i++) {
            pieces.push({
                id: i,
                position: i,
                placed: false
            });
        }
        // Shuffle pieces
        pieces = shuffleArray([...pieces]);
    }
    
    // Render the puzzle game
    function renderPuzzle() {
        const imageUrl = `https://drive.google.com/thumbnail?id=${currentPuzzle.imageId}&sz=w400`;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">
                <div class="question-counter" style="font-family: 'Jameel Noori Nastaleeq', serif;">🧩 پزل گیم - تصویر مکمل کریں 🧩</div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">🧩 پزل ٹکڑوں کو صحیح جگہ پر رکھیں</div>
                    <div style="font-size: 0.8rem; color: #93C5FD;">💡 ${currentPuzzle.hint}</div>
                    <div style="font-size: 0.8rem; color: #93C5FD;">📁 ${currentPuzzle.category}</div>
                </div>
                
                <!-- Puzzle Grid (Drop Area) -->
                <div style="background: #1F2937; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #9CA3AF; margin-bottom: 10px;">🎯 تصویر یہاں بنے گی (پزل ٹکڑے یہاں رکھیں)</div>
                    <div id="puzzleDropGrid" style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 5px; max-width: 400px; margin: 0 auto; aspect-ratio: 1;"></div>
                    <div style="font-size: 0.7rem; color: #6B7280; margin-top: 10px;">✅ رکھے گئے ٹکڑے: ${placedPieces} / ${gridSize * gridSize}</div>
                </div>
                
                <!-- Puzzle Pieces (Drag Source) -->
                <div style="background: #F3F4F6; border-radius: 20px; padding: 20px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 10px;">📦 پزل ٹکڑے (یہاں سے گھسیٹیں)</div>
                    <div id="puzzlePiecesSource" style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 10px; max-width: 400px; margin: 0 auto;"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="resetPuzzleBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">🔄 دوبارہ شروع کریں</button>
                    <button id="newPuzzleBtn" style="background: #2563EB; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">🖼️ نئی تصویر</button>
                </div>
                
                <div style="margin-top: 20px;">
                    <button id="finishPuzzleBtn" style="background: #10B981; color: white; padding: 12px 30px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;" ${!puzzleCompleted ? 'disabled style="opacity:0.5;"' : ''}>
                        ✅ مکمل کیا 🎯
                    </button>
                </div>
            </div>
        `;
        
        // Create drop grid (empty slots)
        const dropGrid = document.getElementById('puzzleDropGrid');
        dropGrid.innerHTML = '';
        for(let i = 0; i < gridSize * gridSize; i++) {
            const slot = document.createElement('div');
            slot.setAttribute('data-slot-id', i);
            slot.style.cssText = `
                aspect-ratio: 1;
                background: #374151;
                border: 2px dashed #6B7280;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            `;
            
            // Check if this slot has a placed piece
            const placedPiece = pieces.find(p => p.placed === true && p.position === i);
            if(placedPiece) {
                // Show the piece image
                const pieceImg = document.createElement('img');
                const pieceX = Math.floor(placedPiece.id / gridSize);
                const pieceY = placedPiece.id % gridSize;
                pieceImg.src = imageUrl;
                pieceImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 6px;
                `;
                // Use clip-path to show only the specific piece
                pieceImg.style.clipPath = `inset(${pieceX * (100/gridSize)}% ${(gridSize - pieceY - 1) * (100/gridSize)}% ${(gridSize - pieceX - 1) * (100/gridSize)}% ${pieceY * (100/gridSize)}%)`;
                slot.appendChild(pieceImg);
                slot.style.border = '2px solid #10B981';
            } else {
                slot.innerHTML = '<span style="font-size: 0.7rem; color: #6B7280;">?</span>';
            }
            
            slot.ondragover = (e) => e.preventDefault();
            slot.ondrop = (e) => {
                e.preventDefault();
                if(puzzleCompleted) {
                    showToast('پزل مکمل ہو چکا ہے! نئی تصویر منتخب کریں', 'info');
                    return;
                }
                
                const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
                const piece = pieces.find(p => p.id === pieceId && !p.placed);
                if(!piece) return;
                
                const slotId = parseInt(slot.getAttribute('data-slot-id'));
                
                // Check if slot is empty
                const slotTaken = pieces.find(p => p.placed === true && p.position === slotId);
                if(slotTaken) {
                    showToast('یہ جگہ پہلے سے بھری ہوئی ہے!', 'info');
                    return;
                }
                
                // Place the piece
                piece.placed = true;
                piece.position = slotId;
                placedPieces++;
                
                // Remove the piece from source
                const sourcePiece = document.querySelector(`#puzzlePiecesSource div[data-piece-id="${pieceId}"]`);
                if(sourcePiece) {
                    sourcePiece.remove();
                }
                
                // Update drop grid
                renderPuzzle();
                
                // Check if puzzle is complete
                if(placedPieces === gridSize * gridSize) {
                    puzzleCompleted = true;
                    playSuccessSound();
                    showToast(`🎉 مبارک! پزل مکمل ہو گیا! ${currentPuzzle.funFact} 🎉`, 'success');
                    showClapping();
                    document.getElementById('finishPuzzleBtn').disabled = false;
                    document.getElementById('finishPuzzleBtn').style.opacity = '1';
                } else {
                    showToast(`✅ ٹکڑا رکھ دیا! اب ${gridSize * gridSize - placedPieces} ٹکڑے باقی ہیں`, 'success');
                }
            };
            dropGrid.appendChild(slot);
        }
        
        // Create source pieces (unplaced pieces)
        const sourceContainer = document.getElementById('puzzlePiecesSource');
        sourceContainer.innerHTML = '';
        const unplacedPieces = pieces.filter(p => !p.placed);
        unplacedPieces.forEach(piece => {
            const pieceDiv = document.createElement('div');
            pieceDiv.setAttribute('data-piece-id', piece.id);
            pieceDiv.style.cssText = `
                aspect-ratio: 1;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                background-image: url(${imageUrl});
                background-size: ${gridSize * 100}%;
                background-position: ${(piece.id % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.id / gridSize) * (100 / (gridSize - 1))}%;
                background-repeat: no-repeat;
            `;
            pieceDiv.onmouseenter = () => pieceDiv.style.transform = 'scale(1.05)';
            pieceDiv.onmouseleave = () => pieceDiv.style.transform = 'scale(1)';
            pieceDiv.draggable = true;
            pieceDiv.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', piece.id);
            };
            sourceContainer.appendChild(pieceDiv);
        });
        
        // Reset button
        document.getElementById('resetPuzzleBtn').onclick = () => {
            createPuzzlePieces();
            placedPieces = 0;
            puzzleCompleted = false;
            renderPuzzle();
            showToast('پزل دوبارہ شروع ہو گیا!', 'info');
        };
        
        // New Puzzle button
        document.getElementById('newPuzzleBtn').onclick = () => {
            const newIndex = Math.floor(Math.random() * puzzleImages.length);
            currentPuzzle = puzzleImages[newIndex];
            createPuzzlePieces();
            placedPieces = 0;
            puzzleCompleted = false;
            renderPuzzle();
            showToast(`نیا پزل شروع ہو گیا: ${currentPuzzle.name}`, 'success');
        };
        
        // Finish button
        document.getElementById('finishPuzzleBtn').onclick = () => {
            if(puzzleCompleted) {
                totalScore += 10;
                scoreEl.textContent = totalScore;
                document.getElementById('methodModal').style.display = 'none';
                showToast(`+10 پوائنٹس! 🌟 پزل مکمل کرنے پر مبارک!`, 'success');
                
                // Celebration
                for(let i=0; i<20; i++) {
                    const conf = document.createElement('div');
                    conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','🧩'][Math.floor(Math.random()*7)];
                    conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                    document.body.appendChild(conf);
                    setTimeout(()=>conf.remove(),2000);
                }
            } else {
                showToast('پہلے پزل مکمل کریں! تمام ٹکڑے رکھیں', 'error');
            }
        };
    }
    
    // Initialize puzzle
    createPuzzlePieces();
    placedPieces = 0;
    puzzleCompleted = false;
    renderPuzzle();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 29: METHOD 22 - جملہ سازی
// ========================================== */
// ========================================== */
// SECTION 29: METHOD 22 - جملہ سازی
// (Sentence Making - Arrange Words to Form Correct Sentences)
// الفاظ کو صحیح ترتیب میں لگا کر جملہ بنائیں
// 10-15 Random Questions | No Repeat
// Font: Jameel Noori Nastaleeq
// ========================================== */

function method22_SentenceMaking() {
    // ==========================================
    // SENTENCE DATABASE
    // Each sentence is broken into words in wrong order
    // Student must arrange words in correct order
    // ==========================================
    
    const sentencesDatabase = [
        {
            correctOrder: ["میں", "سکول", "جاتا", "ہوں"],
            words: ["جاتا", "میں", "ہوں", "سکول"],
            imageId: "1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2",
            hint: "میں روزانہ سکول جاتا ہوں",
            meaning: "I go to school"
        },
        {
            correctOrder: ["وہ", "کتاب", "پڑھ", "رہا", "ہے"],
            words: ["رہا", "وہ", "ہے", "پڑھ", "کتاب"],
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "وہ کتاب پڑھ رہا ہے",
            meaning: "He is reading a book"
        },
        {
            correctOrder: ["آج", "موسم", "بہت", "اچھا", "ہے"],
            words: ["بہت", "ہے", "آج", "اچھا", "موسم"],
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            hint: "آج موسم بہت اچھا ہے",
            meaning: "Today the weather is very good"
        },
        {
            correctOrder: ["وہ", "باغ", "میں", "پھول", "کھلا", "رہا", "ہے"],
            words: ["رہا", "وہ", "میں", "ہے", "کھلا", "پھول", "باغ"],
            imageId: "1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x",
            hint: "وہ باغ میں پھول کھلا رہا ہے",
            meaning: "He is opening flowers in the garden"
        },
        {
            correctOrder: ["میری", "ماں", "بہت", "پیاری", "ہے"],
            words: ["پیاری", "میری", "ہے", "ماں", "بہت"],
            imageId: "1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-",
            hint: "میری ماں بہت پیاری ہے",
            meaning: "My mother is very dear"
        },
        {
            correctOrder: ["ہم", "اپنے", "وطن", "سے", "محبت", "کرتے", "ہیں"],
            words: ["کرتے", "ہم", "ہیں", "سے", "اپنے", "محبت", "وطن"],
            imageId: "1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz",
            hint: "ہم اپنے وطن سے محبت کرتے ہیں",
            meaning: "We love our country"
        },
        {
            correctOrder: ["پاکستان", "ایک", "خوبصورت", "ملک", "ہے"],
            words: ["ہے", "پاکستان", "خوبصورت", "ایک", "ملک"],
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            hint: "پاکستان ایک خوبصورت ملک ہے",
            meaning: "Pakistan is a beautiful country"
        },
        {
            correctOrder: ["استاد", "طلباء", "کو", "تعلیم", "دیتے", "ہیں"],
            words: ["دیتے", "ہیں", "استاد", "کو", "طلباء", "تعلیم"],
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            hint: "استاد طلباء کو تعلیم دیتے ہیں",
            meaning: "Teachers give education to students"
        },
        {
            correctOrder: ["زندگی", "میں", "محنت", "کامیابی", "کا", "راز", "ہے"],
            words: ["ہے", "زندگی", "محنت", "کا", "میں", "راز", "کامیابی"],
            imageId: "1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB",
            hint: "زندگی میں محنت کامیابی کا راز ہے",
            meaning: "Hard work is the key to success in life"
        },
        {
            correctOrder: ["صحت", "انسان", "کی", "سب", "بڑی", "نعمت", "ہے"],
            words: ["ہے", "صحت", "نعمت", "کی", "انسان", "بڑی", "سب"],
            imageId: "1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk",
            hint: "صحت انسان کی سب بڑی نعمت ہے",
            meaning: "Health is the greatest blessing for a human"
        },
        {
            correctOrder: ["تعلیم", "ہر", "بچے", "کا", "بنیادی", "حق", "ہے"],
            words: ["ہے", "تعلیم", "حق", "کا", "ہر", "بنیادی", "بچے"],
            imageId: "1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh",
            hint: "تعلیم ہر بچے کا بنیادی حق ہے",
            meaning: "Education is the fundamental right of every child"
        },
        {
            correctOrder: ["دوستی", "ایک", "انمول", "تحفہ", "ہے"],
            words: ["ہے", "دوستی", "تحفہ", "ایک", "انمول"],
            imageId: "1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17",
            hint: "دوستی ایک انمول تحفہ ہے",
            meaning: "Friendship is a priceless gift"
        },
        {
            correctOrder: ["سچ", "بولنا", "ہر", "مسلمان", "کا", "فرض", "ہے"],
            words: ["ہے", "سچ", "فرض", "کا", "ہر", "مسلمان", "بولنا"],
            imageId: "1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am",
            hint: "سچ بولنا ہر مسلمان کا فرض ہے",
            meaning: "Speaking truth is the duty of every Muslim"
        },
        {
            correctOrder: ["صبح", "سویرے", "اٹھنا", "صحت", "کے", "لیے", "اچھا", "ہے"],
            words: ["ہے", "صبح", "اٹھنا", "کے", "سویرے", "لیے", "اچھا", "صحت"],
            imageId: "1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd",
            hint: "صبح سویرے اٹھنا صحت کے لیے اچھا ہے",
            meaning: "Waking up early in the morning is good for health"
        }
    ];
    
    // Sound Effects
    function playClapping() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 1200;
            gain1.gain.value = 0.3;
            osc1.start();
            gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            osc1.stop(now + 0.15);
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1100;
                gain2.gain.value = 0.25;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
                osc2.stop(now + 0.3);
            }, 100);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    function showThumbDown() {
        const thumb = document.createElement('div');
        thumb.innerHTML = '👎';
        thumb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:5rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;';
        document.body.appendChild(thumb);
        setTimeout(() => thumb.remove(), 800);
    }
    
    function showClapping() {
        const clapDiv = document.createElement('div');
        clapDiv.innerHTML = '👏🎉👏';
        clapDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:2000;animation:floatUp 0.8s forwards;pointer-events:none;white-space:nowrap;';
        document.body.appendChild(clapDiv);
        setTimeout(() => clapDiv.remove(), 800);
    }
    
    // Get random questions (10-15, no repeat)
    function getRandomQuestions() {
        const totalQuestions = Math.floor(Math.random() * 6) + 10; // 10 to 15
        const shuffled = shuffleArray([...sentencesDatabase]);
        return shuffled.slice(0, totalQuestions);
    }
    
    let questions = getRandomQuestions();
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let selectedWords = [];
    
    function renderQuestion() {
        const current = questions[currentIndex];
        const correctSentence = current.correctOrder.join(" ");
        const imageUrl = `https://drive.google.com/thumbnail?id=${current.imageId}&sz=w200`;
        
        // Create word pool (shuffled words)
        const wordPool = shuffleArray([...current.words]);
        selectedWords = new Array(current.correctOrder.length).fill('');
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:15px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;">
                <div class="question-counter" style="font-family: 'Jameel Noori Nastaleeq', serif;">📝 سوال ${currentIndex + 1} / ${totalQuestions}</div>
                <div class="question-progress"><div class="question-progress-fill" style="width:${((currentIndex + 1) / totalQuestions) * 100}%"></div></div>
                
                <div style="background: linear-gradient(145deg, #1E40AF, #2563EB, #3B82F6); border-radius: 30px; padding: 25px 20px; margin: 20px 0;">
                    <div style="font-size: 0.9rem; color: #FCD34D; margin-bottom: 10px;">📝 الفاظ کو صحیح ترتیب میں لگا کر جملہ بنائیں 📝</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <img src="${imageUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 15px; border: 2px solid white;"
                             onerror="this.src='https://via.placeholder.com/80x80/2563EB/white?text=📖'">
                        <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 10px 15px;">
                            <div style="font-size: 0.8rem; color: #93C5FD;">💡 ${current.hint}</div>
                            <div style="font-size: 0.7rem; color: #93C5FD;">🇬🇧 ${current.meaning}</div>
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #2563EB; margin: 15px 0; font-family: 'Jameel Noori Nastaleeq', serif;">📖 صحیح جملہ بنائیں</h3>
                
                <!-- Word Pool (Drag Source) -->
                <div style="background: #F3F4F6; border-radius: 20px; padding: 15px; margin: 15px 0;">
                    <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 10px;">📦 یہاں سے الفاظ گھسیٹیں</div>
                    <div id="wordPoolSource" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;"></div>
                </div>
                
                <!-- Sentence Building Area (Drop Zones) -->
                <div style="background: #E0E7FF; border-radius: 20px; padding: 20px; margin: 15px 0; border: 2px dashed #2563EB;">
                    <div style="font-size: 0.8rem; color: #2563EB; margin-bottom: 10px;">🎯 جملہ یہاں بنے گا</div>
                    <div id="sentenceDropArea" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; direction: rtl;"></div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="clearSentenceBtn" style="background: #F59E0B; color: white; padding: 10px 25px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">🗑️ صاف کریں</button>
                    <button id="checkSentenceBtn" style="background: #10B981; color: white; padding: 10px 30px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">✅ چیک کریں</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 25px;">
                    <button id="prevSentenceBtn" style="background: #F59E0B; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">◀ پچھلا</button>
                    <button id="nextSentenceBtn" style="background: #2563EB; color: white; padding: 12px 25px; border: none; border-radius: 60px; cursor: pointer; font-family: 'Jameel Noori Nastaleeq', serif;">اگلا ▶</button>
                </div>
            </div>
        `;
        
        // Populate word pool source (draggable words)
        const sourceContainer = document.getElementById('wordPoolSource');
        wordPool.forEach((word, idx) => {
            const wordCard = document.createElement('div');
            wordCard.textContent = word;
            wordCard.setAttribute('data-word', word);
            wordCard.setAttribute('data-idx', idx);
            wordCard.style.cssText = `
                padding: 12px 20px;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                color: white;
                border-radius: 50px;
                cursor: grab;
                font-size: 1rem;
                font-family: 'Jameel Noori Nastaleeq', serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.2s;
                display: inline-block;
            `;
            wordCard.onmouseenter = () => wordCard.style.transform = 'scale(1.05)';
            wordCard.onmouseleave = () => wordCard.style.transform = 'scale(1)';
            wordCard.draggable = true;
            wordCard.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    word: word,
                    sourceIdx: idx
                }));
            };
            sourceContainer.appendChild(wordCard);
        });
        
        // Create drop zones for each word position
        const dropArea = document.getElementById('sentenceDropArea');
        for(let i = 0; i < current.correctOrder.length; i++) {
            const slot = document.createElement('div');
            slot.setAttribute('data-slot-index', i);
            slot.style.cssText = `
                padding: 12px 20px;
                min-width: 80px;
                background: white;
                border: 2px dashed #2563EB;
                border-radius: 50px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-family: 'Jameel Noori Nastaleeq', serif;
                color: #9CA3AF;
                transition: all 0.2s;
            `;
            slot.innerHTML = `<span style="font-size: 0.7rem;">${i+1}</span>`;
            
            slot.ondragover = (e) => e.preventDefault();
            slot.ondrop = (e) => {
                e.preventDefault();
                const slotIndex = parseInt(slot.getAttribute('data-slot-index'));
                
                // If slot already filled, don't allow drop
                if(selectedWords[slotIndex] !== '') {
                    showToast('یہ جگہ پہلے سے بھری ہوئی ہے!', 'info');
                    return;
                }
                
                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const word = dragData.word;
                
                // Find and remove the dragged element from source
                const draggedElement = document.querySelector(`#wordPoolSource div[data-word="${word}"][data-idx="${dragData.sourceIdx}"]`);
                if(draggedElement) {
                    draggedElement.remove();
                }
                
                // Fill the slot
                selectedWords[slotIndex] = word;
                slot.innerHTML = word;
                slot.style.background = '#D1FAE5';
                slot.style.border = '2px solid #10B981';
                slot.style.color = '#059669';
                
                // Check if all slots are filled
                if(!selectedWords.includes('')) {
                    // Auto-check when all words are placed
                    setTimeout(() => {
                        document.getElementById('checkSentenceBtn').click();
                    }, 500);
                }
            };
            dropArea.appendChild(slot);
        }
        
        // Clear button
        document.getElementById('clearSentenceBtn').onclick = () => {
            // Reset selected words
            selectedWords = new Array(current.correctOrder.length).fill('');
            
            // Clear all drop slots
            const slots = document.querySelectorAll('#sentenceDropArea div');
            slots.forEach((slot, idx) => {
                slot.innerHTML = `<span style="font-size: 0.7rem;">${idx+1}</span>`;
                slot.style.background = 'white';
                slot.style.border = '2px dashed #2563EB';
                slot.style.color = '#9CA3AF';
            });
            
            // Rebuild source area with all original words
            const sourceContainer = document.getElementById('wordPoolSource');
            sourceContainer.innerHTML = '';
            const newWordPool = shuffleArray([...current.words]);
            newWordPool.forEach((word, idx) => {
                const wordCard = document.createElement('div');
                wordCard.textContent = word;
                wordCard.setAttribute('data-word', word);
                wordCard.setAttribute('data-idx', idx);
                wordCard.style.cssText = `
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    border-radius: 50px;
                    cursor: grab;
                    font-size: 1rem;
                    font-family: 'Jameel Noori Nastaleeq', serif;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    display: inline-block;
                `;
                wordCard.onmouseenter = () => wordCard.style.transform = 'scale(1.05)';
                wordCard.onmouseleave = () => wordCard.style.transform = 'scale(1)';
                wordCard.draggable = true;
                wordCard.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        word: word,
                        sourceIdx: idx
                    }));
                };
                sourceContainer.appendChild(wordCard);
            });
            
            showToast('صاف کر دیا گیا! دوبارہ ترتیب دیں', 'info');
        };
        
        // Check button
        document.getElementById('checkSentenceBtn').onclick = () => {
            // Check if all slots are filled
            if(selectedWords.includes('')) {
                showToast(`براہ کرم تمام ${current.correctOrder.length} الفاظ رکھیں!`, 'error');
                return;
            }
            
            // Compare with correct order
            const userSentence = selectedWords.join(' ');
            const correctSentence = current.correctOrder.join(' ');
            
            if(userSentence === correctSentence) {
                score++;
                showClapping();
                playClapping();
                showToast(`🎉 مبارک! جملہ درست ہے: "${correctSentence}" 🎉`, 'success');
                
                // Disable all drag items
                document.querySelectorAll('#wordPoolSource div').forEach(item => {
                    item.draggable = false;
                    item.style.opacity = '0.5';
                    item.style.cursor = 'default';
                });
                
                // Disable drop slots
                document.querySelectorAll('#sentenceDropArea div').forEach(slot => {
                    slot.style.background = '#10B981';
                    slot.style.border = '2px solid #10B981';
                    slot.style.color = 'white';
                    slot.ondragover = null;
                    slot.ondrop = null;
                });
                
                document.getElementById('clearSentenceBtn').style.pointerEvents = 'none';
                document.getElementById('checkSentenceBtn').style.pointerEvents = 'none';
                document.getElementById('clearSentenceBtn').style.opacity = '0.5';
                document.getElementById('checkSentenceBtn').style.opacity = '0.5';
                
                setTimeout(() => {
                    if(currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 1500);
            } else {
                showThumbDown();
                showToast(`❌ غلط! صحیح جملہ "${correctSentence}" ہے۔ دوبارہ ترتیب دیں!`, 'error');
                
                // Highlight incorrect slots in red
                const slots = document.querySelectorAll('#sentenceDropArea div');
                for(let i = 0; i < current.correctOrder.length; i++) {
                    if(selectedWords[i] !== current.correctOrder[i]) {
                        slots[i].style.background = '#FEE2E2';
                        slots[i].style.border = '2px solid #EF4444';
                        setTimeout(() => {
                            if(selectedWords[i] !== '') {
                                slots[i].style.background = '#D1FAE5';
                                slots[i].style.border = '2px solid #10B981';
                            } else {
                                slots[i].style.background = 'white';
                                slots[i].style.border = '2px dashed #2563EB';
                            }
                        }, 1000);
                    }
                }
            }
        };
        
        // Previous button
        document.getElementById('prevSentenceBtn').onclick = () => {
            if(currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            } else {
                showToast('یہ پہلا سوال ہے!', 'info');
            }
        };
        
        // Next button (skip)
        document.getElementById('nextSentenceBtn').onclick = () => {
            if(currentIndex + 1 < totalQuestions) {
                currentIndex++;
                renderQuestion();
                showToast('اگلے سوال پر جائیں', 'info');
            } else {
                showToast('یہ آخری سوال ہے! مکمل کریں', 'info');
            }
        };
    }
    
    function finishQuiz() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = '';
        let emoji = '';
        
        if(percentage === 100) {
            message = '🎉 پرفیکٹ! تم نے سب جملے درست بنائے! 🎉';
            emoji = '🏆🌟👏';
        } else if(percentage >= 80) {
            message = '👍 بہت خوب! تم نے بہترین کارکردگی دکھائی!';
            emoji = '⭐🎯';
        } else if(percentage >= 60) {
            message = '📖 اچھی کوشش! مزید مشق کرو';
            emoji = '📚✨';
        } else {
            message = '💪 کوئی بات نہیں! دوبارہ کوشش کرو';
            emoji = '💪🎓';
        }
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center; padding:25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                <div style="font-size:4rem; margin-bottom:15px;">${emoji}</div>
                <div style="font-size:3rem;">🏆</div>
                <h3 style="color:#2563EB; font-size:1.5rem; margin:15px 0;">مبارک ہو!</h3>
                <p style="font-size:1.2rem;">آپ نے <strong>${totalQuestions}</strong> میں سے <strong>${score}</strong> جملے درست بنائے</p>
                <div style="background: linear-gradient(135deg, #10B981, #059669); padding:15px; border-radius:20px; margin:15px 0;">
                    <span style="font-size:1.3rem; color:white;">📊 اسکور: ${score}/${totalQuestions} (${percentage}%)</span>
                </div>
                <p style="color:#6B7280;">${message}</p>
                <button id="finishMethod22Btn" style="background: linear-gradient(135deg, #2563EB, #3B82F6); color: white; padding: 14px 35px; border: none; border-radius: 60px; cursor: pointer; font-size: 1.1rem; margin-top: 25px; font-family: 'Jameel Noori Nastaleeq', serif;">
                    ✅ مکمل کیا 🎯
                </button>
            </div>
        `;
        
        document.getElementById('finishMethod22Btn').onclick = () => {
            totalScore += score;
            scoreEl.textContent = totalScore;
            document.getElementById('methodModal').style.display = 'none';
            showToast(`+${score} پوائنٹس! 🌟`, 'success');
            
            for(let i=0; i<20; i++) {
                const conf = document.createElement('div');
                conf.innerHTML = ['🎉','🏆','⭐','🌟','👏','🎯','📝'][Math.floor(Math.random()*7)];
                conf.style.cssText = `position:fixed;left:${Math.random()*100}%;top:0%;font-size:1.8rem;pointer-events:none;animation:floatUp 2s forwards;z-index:1000;`;
                document.body.appendChild(conf);
                setTimeout(()=>conf.remove(),2000);
            }
        };
    }
    
    renderQuestion();
    document.getElementById('methodModal').style.display = 'flex';
}
// ========================================== */
// SECTION 30: METHODS GRID BUILDER
// ========================================== */

function buildMethodsGrid() {
    const grid = document.getElementById('methodsGrid');
    if(!grid) return;
    grid.innerHTML = METHODS_LIST.map(m => `<div class="method-card" data-id="${m.id}"><div class="method-icon">${m.icon}</div><div class="method-title">${m.name}</div><div class="method-desc">${m.desc} (${m.questions} سوالات)</div></div>`).join('');
    
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            if(id === 1) method1_HarfBaHarf();
            else if(id === 2) method2_ImageToWord();
            else if(id === 3) method3_FirstLetter();
            else if(id === 4) method4_LastLetter();
             else if(id === 5) method5_MixedUp();
            else if(id === 6) method6_SimilarLetters();
            else if(id === 7) method7_Flashcards();
            else if(id === 8) method8_FillBlank();
            else if(id === 9) method9_TwoLetter();
            else if(id === 10) method10_ThreeLetter();
            else if(id === 11) method11_HiddenImage();
            else if(id === 12) method12_MatchingGame();
            else if(id === 14) method14_LetterShapes();
           else if(id === 15) method15_BrokenLetters();
            else if(id === 16) method16_RightToLeft();
           else if(id === 17) method17_NoJoinLetters();
            else if(id === 18) method18_FullJoinLetters();
            else if(id === 19) method19_DragDrop();
            else if(id === 21) method21_Puzzle();
            else if(id === 22) method22_SentenceMaking();
        });
    });
}

// ========================================== */
// SECTION 31: EVENT LISTENERS
// ========================================== */

startGameBtn.addEventListener('click', startGame);
checkBtn.addEventListener('click', checkWord);
clearBtn.addEventListener('click', clearSelection);
hintBtn.addEventListener('click', giveHint);
document.getElementById('closeModalBtn')?.addEventListener('click', () => document.getElementById('methodModal').style.display = 'none');
document.getElementById('themeBtn')?.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('darkMode', document.body.classList.contains('dark')); });
document.getElementById('scrollUp')?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
document.getElementById('scrollDown')?.addEventListener('click', () => window.scrollTo({ top:document.body.scrollHeight, behavior:'smooth' }));
document.getElementById('homeBtn')?.addEventListener('click', () => window.location.href = 'https://magicrills.com');
document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

// Level buttons
document.querySelectorAll('.level-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    changeLevel(btn.dataset.level);
}));

// Share buttons
const shareContainer = document.getElementById('shareButtons');
if(shareContainer) {
    shareContainer.innerHTML = `<button class="share-btn" data-platform="facebook"><span class="material-icons">facebook</span></button><button class="share-btn" data-platform="twitter"><span class="material-icons">alternate_email</span></button><button class="share-btn" data-platform="whatsapp"><span class="material-icons">chat</span></button><button class="share-btn" data-platform="linkedin"><span class="material-icons">business_center</span></button>`;
    document.querySelectorAll('.share-btn').forEach(btn => btn.addEventListener('click', () => shareOn(btn.dataset.platform)));
}

// ========================================== */
// FULLSCREEN FUNCTIONALITY
// ========================================== */

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        const fsBtn = document.getElementById('fullscreenBtn');
        if(fsBtn) fsBtn.innerHTML = '<span class="material-icons">fullscreen_exit</span> 🖥️ باہر نکلیں';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        const fsBtn = document.getElementById('fullscreenBtn');
        if(fsBtn) fsBtn.innerHTML = '<span class="material-icons">fullscreen</span> 🖥️ مکمل سکرین';
    }
}

// Fullscreen button event
const fullscreenBtn = document.getElementById('fullscreenBtn');
if(fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);

function updateFullscreenButton() {
    const btn = document.getElementById('fullscreenBtn');
    if (!btn) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        btn.innerHTML = '<span class="material-icons">fullscreen_exit</span> 🖥️ باہر نکلیں';
    } else {
        btn.innerHTML = '<span class="material-icons">fullscreen</span> 🖥️ مکمل سکرین';
    }
}

// F11 key support
document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});// ========================================== */
// SECTION 32: INITIALIZATION
// ========================================== */

if(localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
window.addEventListener('load', () => {
    buildMethodsGrid();
    loadReactions();
    incrementUsage();
    console.log('✅ MagicRills Urdu Jor Tor v4.0 Loaded!');
    console.log('✅ Methods 1,2,3 are COMPLETE');
    console.log('✅ Methods 4-22 are READY for updates');
});
