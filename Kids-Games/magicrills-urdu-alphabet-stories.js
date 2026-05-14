// ============================================
// MAGICRILLS URDU ALPHABET STORIES - COMPLETE
// ALL 30 WAYS WORKING
// ============================================

// ============================================
// SECTION 1: STORY DATA (37 HURUF)
// ============================================
const storyData = {
    alif: {
        title: "الف کی کہانی",
        text: "ایک دن احمد باغ میں گیا۔ اسے ایک بہت بڑا سرخ انار نظر آیا۔ احمد نے انار توڑا اور اسے گھر لے آیا۔ اس کی امی نے کہا 'بیٹا، انار کو سب کے ساتھ بانٹو'۔ احمد نے اپنے دوستوں اور بہن بھائیوں کو انار کے دانے کھلائے۔ سب نے مل کر انار کھایا اور بہت خوش ہوئے۔ انجیر اور انگور بھی تھے جو سب نے مل کر کھائے۔ اونٹ نے بھی آ کر انار کے چھلکے کھائے۔",
        moral: "✨ سبق: جو کچھ ہمیں ملتا ہے، ہمیں اسے دوسروں کے ساتھ بانٹنا چاہیے۔",
        images: ["https://drive.google.com/thumbnail?id=1fkqAND0Wj0CZ-vin06nS-ANTG9yHwkC_&sz=w1000","https://drive.google.com/thumbnail?id=1msORDt3iTIy2jWVjapMNi8jhDCLTXvNk&sz=w1000","https://drive.google.com/thumbnail?id=1yZFdi1rzD4YMlxKE_Vs19KuY7vyIZuT_&sz=w1000","https://drive.google.com/thumbnail?id=1skY1eplZ1J3EgC6JG8IAgUgmekWYhjaz&sz=w1000","https://drive.google.com/thumbnail?id=11RmGlbx0zmvPiv49-iUXCzaGNAcQYEXe&sz=w1000","https://drive.google.com/thumbnail?id=1t6ihscWHSzPlWTX_jxbwRZPlZ7YBCub6&sz=w1000"]
    },
    'alif-mad-aa': {
        title: "آ کی کہانی",
        text: "آلو، آم اور آڑو تینوں بہترین دوست تھے۔ ایک دن انہوں نے جنگل میں پکنک منانے کا فیصلہ کیا۔ راستے میں انہیں آلوبخارہ ملا جو ان کے ساتھ چل پڑا۔ انہوں نے مل کر آگ جلائی اور کھانا پکایا۔ اچانک آگ بھڑک اٹھی تو آنکھ نے سب کو آگاہ کیا۔ سب نے مل کر آگ بجھائی اور اپنی جان بچائی۔ اس دن کے بعد انہوں نے سیکھا کہ آگ سے کھیلنا بہت خطرناک ہے۔",
        moral: "✨ سبق: آگ کے ساتھ کھیلنا بہت خطرناک ہوتا ہے، ہمیشہ احتیاط کریں۔",
        images: ["https://drive.google.com/thumbnail?id=1n3M6PoMHgMmkNezrPnjVfXh-ILhB5Vbd&sz=w1000","https://drive.google.com/thumbnail?id=1MLc816ydlsQQCXmmN8NvBKrTlI8JXYBE&sz=w1000","https://drive.google.com/thumbnail?id=1nUuuAicDLjWU-aOdmCwne1RAOPu0eLxF&sz=w1000","https://drive.google.com/thumbnail?id=1CMObw5r8g2fb7qv-LQCKO9Xow4SR8YD_&sz=w1000","https://drive.google.com/thumbnail?id=1GUtj2Ktsa7P6PSgTXi4Xh8-eM4buS7Pt&sz=w1000","https://drive.google.com/thumbnail?id=1IRPiTGxlDuqD_0YaMZYTYgUmHQa0xM7D&sz=w1000"]
    },
    bay: {
        title: "ب کی کہانی",
        text: "بلبل اپنے گھونسلے میں بیٹھی تھی۔ اچانک اس نے دیکھا کہ ایک بکری باغ میں گھوم رہی ہے۔ بلبل نے بکری سے کہا 'کیا تم میرے ساتھ دوستی کروگی؟' بکری خوش ہوگئی اور دونوں دوست بن گئے۔ اگلے دن ایک بندر بھی ان کے ساتھ شامل ہوگیا۔ تینوں نے مل کر باغ کی سیر کی اور بہت مزے کیے۔ ان کی دوستی کا چرچا پورے گاؤں میں ہوگیا۔ بیل اور بلی بھی ان کے ساتھ شامل ہوگئے۔",
        moral: "✨ سبق: دوستی بہت قیمتی ہوتی ہے، ہمیشہ دوسروں سے پیار کریں۔",
        images: ["https://drive.google.com/thumbnail?id=1kylxXL09CeUR2z2vwBUTCJXu9mFAnAdX&sz=w1000","https://drive.google.com/thumbnail?id=1PSJe3OczLazIz2qohrhCRXAyWh1gdxD-&sz=w1000","https://drive.google.com/thumbnail?id=1xmXcEOpIF19C1h6kGpWeUwkv05nmlp9m&sz=w1000","https://drive.google.com/thumbnail?id=1KjJnnzK7MVnR4Y1gxDuq5FgUS7vIZgoK&sz=w1000","https://drive.google.com/thumbnail?id=195uQPWZsukNoAkVDipAdzStzStdOeAWH&sz=w1000","https://drive.google.com/thumbnail?id=1PxAGGbLyWaZORmcMBOzC1NO02gEfiD7x&sz=w1000"]
    },
    pay: {
        title: "پ کی کہانی",
        text: "پانی بہت قیمتی نعمت ہے۔ ایک دن پودا بہت مرجھا گیا کیونکہ اسے پانی نہیں ملا۔ پیاسا پنکھی بھی پانی کی تلاش میں ادھر ادھر اڑ رہا تھا۔ اچانک بادل برس پڑے اور پانی ہر جگہ پھیل گیا۔ پودا ہرا بھرا ہوگیا اور پنکھی نے سیر ہو کر پانی پیا۔ سب نے سیکھا کہ پانی کو ضائع نہیں کرنا چاہیے۔ پنسل اور پیاز نے بھی پانی کی اہمیت کو سمجھا۔",
        moral: "✨ سبق: پانی ہماری زندگی ہے، اسے ضائع کرنا بہت بڑی غلطی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1U2sIzQzUcRMkn0bPhJSlpCZ806zdQLbc&sz=w1000","https://drive.google.com/thumbnail?id=1AZA0eFqseIVKI_oZ86X4mK4Py5PnPLzg&sz=w1000","https://drive.google.com/thumbnail?id=1kF856Zq7kGk9ADLlZWeR-QmVJnf3VLSz&sz=w1000","https://drive.google.com/thumbnail?id=100GEaX1ST7fh3XrNy-O9zV0liNjTLEYd&sz=w1000","https://drive.google.com/thumbnail?id=19qLMks_EOThEtcIRtBLozpE70g9cf7An&sz=w1000","https://drive.google.com/thumbnail?id=14Ofg1G4kJdTuhEHUML3U4z7jgQWHiX6-&sz=w1000"]
    },
    tay: {
        title: "ت کی کہانی",
        text: "تتلی پھولوں سے رس چوس رہی تھی۔ اچانک اس نے دیکھا کہ ایک تربوز درخت پر لٹک رہا ہے۔ تتلی نے تربوز سے کہا 'کیا میں آپ کے ساتھ کھیل سکتی ہوں؟' تربوز نے مسکراتے ہوئے کہا 'کیوں نہیں'۔ دونوں نے مل کر خوب کھیلا اور مزے کیے۔ شام کو تتلی نے تربوز کو الوداع کہا اور وعدہ کیا کہ وہ کل پھر آئے گی۔ تیل اور ترازو نے بھی ان کی دوستی دیکھی۔",
        moral: "✨ سبق: کھیل کود اور دوستی سے دل خوش رہتا ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1koIBFdYV69LA7Q8hbWXipsQIbyyKk9bO&sz=w1000","https://drive.google.com/thumbnail?id=1Z-NOMx_OaoKeVGlgYnBu-QEoElGkybf6&sz=w1000","https://drive.google.com/thumbnail?id=1MnTDH0BzIwo34UU48Xq0vYZnLtnpTHmr&sz=w1000","https://drive.google.com/thumbnail?id=17DGLNryxH1EN6dVANlrN20yWQK2i0-Mw&sz=w1000","https://drive.google.com/thumbnail?id=1c6kNYLkxGwUTX2YhVvNxI_bpcDrskU6j&sz=w1000","https://drive.google.com/thumbnail?id=1NC365naAm8JHitPLEDeUh-_TxbNmD5G9&sz=w1000"]
    },
    ttay: {
        title: "ٹ کی کہانی",
        text: "ٹیپو نام کا ایک چھوٹا لڑکا تھا۔ اسے ٹیبل پر بیٹھ کر پڑھنا بہت پسند تھا۔ ایک دن اس نے ٹماٹر اور تربوز سے سلاد بنایا۔ ٹیپو نے اپنی امی کو بھی سلاد کھلایا۔ امی نے اسے پیار کیا اور کہا 'تم بہت اچھے ہو'۔ ٹیپو بہت خوش ہوا اور اس نے ٹی وی بھی دیکھا۔ ٹوپی اور ٹرک نے بھی اس کی مدد کی۔",
        moral: "✨ سبق: اپنے بزرگوں کی خدمت کرنا بہت اچھی عادت ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1J4XwYIyOvwFjPTCPe670-G7y6FRzftgq&sz=w1000","https://drive.google.com/thumbnail?id=1UittBNOLlrxEfvMbpW7r8X7T84qMlTGv&sz=w1000","https://drive.google.com/thumbnail?id=1YZVTb7qY6er014J5n6DhepBqX3Mu011c&sz=w1000","https://drive.google.com/thumbnail?id=11VifEs64W1Axpwwt5E4o_sJlIjBQJkqs&sz=w1000","https://drive.google.com/thumbnail?id=17ylMaYjX7vFJboJVKvRIws6FhDhVZL22&sz=w1000","https://drive.google.com/thumbnail?id=1eUvRzibJks-79mNK0Q10t2gyi0cvsFrJ&sz=w1000"]
    },
    say: {
        title: "ث کی کہانی",
        text: "ثمینہ ایک بہت ایماندار لڑکی تھی۔ ایک دن اسے بازار میں ایک تھیلا ملا جس میں بہت سارے پھل تھے۔ ثمینہ نے تھیلا تھانے میں دے دیا۔ تھانے والوں نے اس کی ایمانداری کی تعریف کی۔ جب اصلی مالک آیا تو اس نے ثمینہ کو انعام دیا۔ ثمینہ بہت خوش ہوئی اور اس نے انعام غریبوں میں بانٹ دیا۔ ثمر نے بھی اس کی مدد کی۔",
        moral: "✨ سبق: ایمانداری بہترین عادت ہے، اس کا صلہ ضرور ملتا ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1x0jwx6_7151_UeTigefA0mBCZT8hXgPP&sz=w1000"]
    },
    jeem: {
        title: "ج کی کہانی",
        text: "جاوید اپنی جیب میں جگنو رکھ کر گھوم رہا تھا۔ جگنو کی روشنی بہت خوبصورت تھی۔ جاوید نے سوچا کہ کیوں نہ سب دوستوں کو بلا کر جگنو دکھائے۔ اس نے سب دوستوں کو بلایا اور سب نے جگنو کی روشنی دیکھ کر مزہ کیا۔ جاوید نے جگنو کو آزاد کر دیا کیونکہ اسے سمجھ آیا کہ جانور بھی آزاد رہنا پسند کرتے ہیں۔ جوتا اور جیکٹ نے بھی اس کی مدد کی۔",
        moral: "✨ سبق: جانوروں کو قید نہیں کرنا چاہیے، وہ بھی آزاد رہنا چاہتے ہیں۔",
        images: ["https://drive.google.com/thumbnail?id=1RxoZz1USsk6TFrL2iwbzCzD6O9rbcFsa&sz=w1000","https://drive.google.com/thumbnail?id=11HsvqUk06h0H7vmQqEgMHdmjFNOPg_PK&sz=w1000","https://drive.google.com/thumbnail?id=1llIMwlyvf9WjWmDjxXfuD8ouRBA2mnI9&sz=w1000","https://drive.google.com/thumbnail?id=15biUB_wgBq_Fr2gu5C5N6eQq2Zb2IuXZ&sz=w1000","https://drive.google.com/thumbnail?id=1usD2b4RLTJXvdAS41h2wmZpdxjAiH4Te&sz=w1000","https://drive.google.com/thumbnail?id=1zZR_yASFBnyxhPram_tfUmlc0WOqegLQ&sz=w1000"]
    },
    chay: {
        title: "چ کی کہانی",
        text: "چاند رات کو بہت خوبصورت لگتا ہے۔ چنا نام کا ایک لڑکا تھا جو ہر رات چاند دیکھتا تھا۔ ایک رات اس نے چاند کو چھپتا دیکھا تو وہ پریشان ہوگیا۔ اس کی امی نے بتایا کہ بادل چاند کو ڈھانپ لیتے ہیں۔ چنا نے سیکھا کہ ہر چیز کے پیچھے کوئی نہ کوئی وجہ ہوتی ہے۔ اس نے صبر کرنا سیکھ لیا۔ چوہا اور چڑیا نے بھی اس کی مدد کی۔",
        moral: "✨ سبق: صبر کرنا بہت بڑی خوبی ہے، ہر مسئلے کا حل ہوتا ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1DvwzvT5ZrlXToBdvxgdNVgf2BOvWzM8Z&sz=w1000","https://drive.google.com/thumbnail?id=1ggt5YNF-oGOcjJpewu2_s-OaEiIjYIPx&sz=w1000","https://drive.google.com/thumbnail?id=1iGPRmcpngUQoh4xh0IN3tG4TAsY1Hmpb&sz=w1000","https://drive.google.com/thumbnail?id=1IgX1hY_vwqUQGE95PUjKAWNt9mWoOfOf&sz=w1000","https://drive.google.com/thumbnail?id=1Mz4HxGs_2u11UScOsadkYSB9RtLLUxHL&sz=w1000","https://drive.google.com/thumbnail?id=13S5ak1Mv-Chr8QA2QljayPIaNuz43NU2&sz=w1000"]
    },
    hay: {
        title: "ح کی کہانی",
        text: "حسن نام کا لڑکا بہت اچھا تھا۔ اسے حلوہ پکانا بہت پسند تھا۔ ایک دن اس نے اپنی امی کے لیے حلوہ بنایا۔ امی نے اسے بہت پیار کیا۔ حسن نے حجام سے بال بھی کٹوائے اور حوض کے پاس بیٹھ کر آرام کیا۔ حنا لگانے کی محفل میں بھی اس نے شرکت کی۔ سب نے اس کی تعریف کی۔",
        moral: "✨ سبق: اپنی صلاحیتوں کو دوسروں کی خدمت میں لگائیں۔",
        images: ["https://drive.google.com/thumbnail?id=1K1NAMKMnM0Vfgt71BaEVl188lNBAI3NC&sz=w1000","https://drive.google.com/thumbnail?id=1IVrLZYcSHr_TuVFejFXMdtnbn8q8BOJH&sz=w1000","https://drive.google.com/thumbnail?id=19Dy19YLvj-a7XLSrsecWWPJBXeNrdjm-&sz=w1000","https://drive.google.com/thumbnail?id=1PsQYmNMK-p2MbyYudwx5MhqS78M7-TPA&sz=w1000","https://drive.google.com/thumbnail?id=1evXk2K2HUmGe_JFoMD5mRIjTuHdtDfh1&sz=w1000"]
    },
    kha: {
        title: "خ کی کہانی",
        text: "خالد ایک سچا لڑکا تھا۔ اس نے خوبانی کے درخت لگائے۔ جب خوبانی پکی تو اس نے سب دوستوں کو بلایا۔ خرگوش اور خچر بھی اس کی دعوت میں آئے۔ خالد نے سب کو خوبانی کھلائی اور خط پڑھ کر سنایا جس میں محبت کا پیغام تھا۔ سب نے خوش ہو کر خوبانی کے بیج بھی اکٹھے کیے۔",
        moral: "✨ سبق: سچائی اور محبت سے سب خوش رہتے ہیں۔",
        images: ["https://drive.google.com/thumbnail?id=1ILVS9BtqRF4aNApLYwsy7LoKRIIEWwO2&sz=w1000","https://drive.google.com/thumbnail?id=1ZoEUTSpQ_BItE9RRXVdP-6H3zMPtjnPf&sz=w1000","https://drive.google.com/thumbnail?id=1F13SbGGFNl1TutYeNVBNpInW_vfp8DpA&sz=w1000","https://drive.google.com/thumbnail?id=1HKfJZ0yO2hwkQXFio54ObsJbhtVn75D8&sz=w1000","https://drive.google.com/thumbnail?id=1g6bK-QpZ_ZiPPjdFROgf6mgBX8ZQM1fs&sz=w1000","https://drive.google.com/thumbnail?id=1x5DJPCaN7Qf0Qv32KMG6AwYkV_Uepjol&sz=w1000"]
    },
    dal: {
        title: "د کی کہانی",
        text: "دانیال نہایت ہوشیار تھا۔ اس نے دیکھا کہ ایک بچہ درخت پر چڑھ گیا ہے اور نیچے نہیں اتر پا رہا۔ دانیال دوڑ کر وہاں پہنچا اور بچے کو درخت سے اتارا۔ بچے کی دادی نے دانیال کو دعا دی اور دانے دیے۔ دانیال نے وہ دانے پرندوں کو کھلا دیے۔ اس کے دل میں سب کے لیے پیار تھا۔",
        moral: "✨ سبق: دوسروں کی مدد کرنا بہت بڑی نیکی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3&sz=w1000","https://drive.google.com/thumbnail?id=1Y_ENdUFryjneIyj7yZZYS4FQ8k7dzPsM&sz=w1000","https://drive.google.com/thumbnail?id=16p8diMs3MvVVbmMlwDE2nd29Y5Pyk5Tz&sz=w1000","https://drive.google.com/thumbnail?id=1-_JCuXs6uyE3zZEUitDIpsUV73P_3UlZ&sz=w1000","https://drive.google.com/thumbnail?id=1chkOG-VeKv0ucomWfPdn5sinm-15evCb&sz=w1000"]
    },
    dhal: {
        title: "ڈ کی کہانی",
        text: "ڈاکو ایک بار جنگل میں گیا۔ اس نے دیکھا کہ ایک ڈبہ درخت کے نیچے رکھا ہے۔ ڈبے میں ڈبل روٹی اور ڈرم تھا۔ ڈاکو نے ڈرم بجایا اور ڈبل روٹی کھائی۔ اچانک ایک ڈولفن دریا سے نکلی اور اس کے ساتھ ناچنے لگی۔ ڈاکو نے اپنا ڈنڈا پھینک کر ڈولفن کو بھی بچایا۔",
        moral: "✨ سبق: جنگل اور جانوروں کی حفاظت کرنی چاہیے۔",
        images: ["https://drive.google.com/thumbnail?id=1005rzD1Hk88hKxvp0XI6WTKIVQr_7sk3&sz=w1000","https://drive.google.com/thumbnail?id=1Y_ENdUFryjneIyj7yZZYS4FQ8k7dzPsM&sz=w1000","https://drive.google.com/thumbnail?id=16p8diMs3MvVVbmMlwDE2nd29Y5Pyk5Tz&sz=w1000"]
    },
    zaal: {
        title: "ذ کی کہانی",
        text: "ذاکر ایک ذہین طالب علم تھا۔ اس نے ذرات کو جمع کر کے ایک نیا آلہ بنایا۔ اس آلے سے اس نے ذخیرہ میں رکھی چیزیں صاف کیں۔ اس کے دادا نے اسے ذکر کرنے کا مشورہ دیا۔ ذاکر نے ذکر کیا اور اللہ کا شکر ادا کیا۔ اس کی ذہانت سے سب حیران رہ گئے۔",
        moral: "✨ سبق: علم حاصل کرنا اور اللہ کا شکر ادا کرنا بہت ضروری ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1hwrD0S25T8i-uPeFQ2jZ6Ej2JOPIsmLk&sz=w1000","https://drive.google.com/thumbnail?id=1wxDQpd8JCLCHO1nuIM_gKvE6Z_FIvxNS&sz=w1000","https://drive.google.com/thumbnail?id=1kbGYXItC-zytKQ6-igwVrwT_joCoBkKj&sz=w1000","https://drive.google.com/thumbnail?id=1Ens8MROM59vQ03fQY975tBAW_fhECEGe&sz=w1000","https://drive.google.com/thumbnail?id=1Xk3pNWLLJEqHBgvSOK99ucVpyQ1UpyJX&sz=w1000"]
    },
    ray: {
        title: "ر کی کہانی",
        text: "رانی ایک خوبصورت لڑکی تھی۔ اس کے پاس ایک ریڈیو تھا جس سے وہ گانے سنتی تھی۔ ایک دن اس نے ریچھ کو بچایا جو ربڑ کے گیند پر پھنس گیا تھا۔ رانی نے ریچھ کو روٹی کھلائی اور راکٹ کی سیر کرائی۔ اس کے دل میں سب کے لیے رحم تھا۔",
        moral: "✨ سبق: جانوروں سے محبت کرنا اور ان کی مدد کرنا اچھی عادت ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1_N2OtIRx47kp52Tkk_CtlNiyMfpdAwjF&sz=w1000","https://drive.google.com/thumbnail?id=1tKOYs4HNekLFWCc-ndD8gcFjvJXjuZsK&sz=w1000","https://drive.google.com/thumbnail?id=1B2RAvdSXzKoChc0vanvAD3ixOmv-pqAf&sz=w1000","https://drive.google.com/thumbnail?id=1lxlToamENEmZDeDXb2zaVR8gpo6n7bb7&sz=w1000","https://drive.google.com/thumbnail?id=1TPnp4vwv5vFziQCjl2nARgS5sthDfnwg&sz=w1000","https://drive.google.com/thumbnail?id=1QE2zLPTaVNgHJ7HpYo3tRfdoHCbzDQa1&sz=w1000"]
    },
    rray: {
        title: "ڑ کی کہانی",
        text: "ڑمڑم ایک چھوٹا سا ڈھولک تھا۔ اسے بجانا بہت پسند تھا۔ ایک دن اس نے ریڑھی پر سوار ہو کر پورے گاؤں میں ڈھولک بجایا۔ گاؤں والے خوش ہو گئے اور اسے پیار کرنے لگے۔ اس نے سب کو خوش کر دیا اور اپنے دادا کو بھی حاضر کیا۔",
        moral: "✨ سبق: دوسروں کو خوش کرنا بہت بڑی خوبی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1nPMjNdxAxeQxl84UOtLhZsbDm8K1YLhw&sz=w1000","https://drive.google.com/thumbnail?id=1YiXgR2dmm2HL5-Ao2j39xkEnRjqCQjxd&sz=w1000","https://drive.google.com/thumbnail?id=1fr0CQIsBar1Jni0WesF9aZiCOzsKA0s3&sz=w1000"]
    },
    zay: {
        title: "ز کی کہانی",
        text: "زبیر بہت بہادر لڑکا تھا۔ اس نے ایک بار زرافے اور زیبرا کو بچایا جو زنجیر میں پھنس گئے تھے۔ اس نے زور لگایا اور زنجیر توڑ دی۔ سب جانور آزاد ہو گئے اور زبیر کو دعائیں دیں۔ اس نے سیکھا کہ ہمت سے ہر مشکل حل ہو جاتی ہے۔",
        moral: "✨ سبق: ہمت اور بہادری سے بڑی سے بڑی مشکل حل ہو جاتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1Yia5WCaxAEiZ0TeYTbMkqTkPvTs91fK-&sz=w1000","https://drive.google.com/thumbnail?id=1pkp6hMB1iqN06aLRgh083KK4A2ECZXhu&sz=w1000","https://drive.google.com/thumbnail?id=1VDgmm94Lpkx-RDkyR-OTDBitAPt8rMUt&sz=w1000","https://drive.google.com/thumbnail?id=1nKqLGVAhK5jbff0Ra5G8JDX5tBk4jrOs&sz=w1000","https://drive.google.com/thumbnail?id=1sFEIY_ZX2ev1qqu1idysW1eSOIPEZ2FE&sz=w1000","https://drive.google.com/thumbnail?id=1cVNyIjEAiCzHav3U6LsYX92_AQSeblE8&sz=w1000"]
    },
    seen: {
        title: "س کی کہانی",
        text: "سارہ بہت محنتی طالبہ تھی۔ اس نے سائیکل پر سوار ہو کر سکول جانا شروع کیا۔ راستے میں اسے ایک سانپ ملا جو زخمی تھا۔ سارہ نے سانپ کی مدد کی اور اسے سوجی کھلائی۔ سانپ صحت مند ہو گیا اور سارہ کی دوستی کر لی۔",
        moral: "✨ سبق: ہر جاندار کی مدد کرنی چاہیے، چاہے وہ کوئی بھی ہو۔",
        images: ["https://drive.google.com/thumbnail?id=1BGBfqVuJb7xtT2GUhgMQU1zk2E13AOC2&sz=w1000","https://drive.google.com/thumbnail?id=179OP4-ZOzV8FaKzS4FkBqrGOasIaVcRd&sz=w1000","https://drive.google.com/thumbnail?id=1RGc2Sa3vbtO8E1cycviGo5t9eYdtFOah&sz=w1000","https://drive.google.com/thumbnail?id=1RnWC2d3ulJSfcRzgiTz9_EsFH-i0vxsS&sz=w1000","https://drive.google.com/thumbnail?id=1DmXWzFK4zm9FD6BxmQXHU62trCWBVUup&sz=w1000","https://drive.google.com/thumbnail?id=15kx1G-auwzK2bUGZPm5Q1h3Vb0lowQja&sz=w1000"]
    },
    sheen: {
        title: "ش کی کہانی",
        text: "شہباز ایک شیر دل لڑکا تھا۔ اس نے شلجم کے کھیت میں شکر قندی اگائی۔ ایک دن شملہ مرچ نے اسے چھینکا تو شہباز ہنس پڑا۔ اس نے شطرنج کھیل کر شکار کو ہرایا اور سب کو شکر ادا کی۔ اس کی شجاعت سے سب متاثر ہوئے۔",
        moral: "✨ سبق: شجاعت اور ہنسی مذاق سے زندگی خوشگوار رہتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1wUJMd5LQR1rqK7GsE-NkGZePVqz9Zg17&sz=w1000","https://drive.google.com/thumbnail?id=1f7l-KHjsYKtxRHwnCj4cMY0kbh5EZ1Di&sz=w1000","https://drive.google.com/thumbnail?id=17KP_K5O0mzlNELnft6MyUS8sB_khPEIb&sz=w1000","https://drive.google.com/thumbnail?id=1MpDHkdmwjjGN5FzCmnaXUU8u5JdVr8C3&sz=w1000","https://drive.google.com/thumbnail?id=1KVqUtmT-bfBlmRK743FAozIW2srV3Sg3&sz=w1000","https://drive.google.com/thumbnail?id=1YyAYXGDKrSR2bvDR-3mBD1OY0spPhNjr&sz=w1000"]
    },
    sad: {
        title: "ص کی کہانی",
        text: "صابر بہت صابر اور صاف گو تھا۔ اس نے صابن سے صراحی دھوئی اور صندوق میں صدقہ رکھا۔ اس کی صداقت سے سب خوش تھے۔ اس نے صاف ستھرا رہنے کا عہد کیا اور سب کو صفائی کی اہمیت بتائی۔",
        moral: "✨ سبق: صفائی اور صداقت انسان کو عظیم بناتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=18pQ2i_5GQoDh2RnMg9_xTNrkanAUT5NB&sz=w1000","https://drive.google.com/thumbnail?id=1RbSYF8fcf_wUw07mOMTMCyzG1nQXhU5b&sz=w1000","https://drive.google.com/thumbnail?id=1uUChh93LIGdigADWVoOKFgYLU62Yof_g&sz=w1000","https://drive.google.com/thumbnail?id=1TpnJoj4-5RfXwZgDNem5J9i6fcIiS7nv&sz=w1000","https://drive.google.com/thumbnail?id=1s7Pd3qHrjnq3ob07YM3O8z84zLttH0ml&sz=w1000","https://drive.google.com/thumbnail?id=1A93NLA3_EI_jUCPVyj5mEodXPackbSdl&sz=w1000"]
    },
    zad: {
        title: "ض کی کہانی",
        text: "ضیا ایک ضدی لڑکا تھا لیکن اس کی دادی نے اسے سمجھایا۔ اس نے ضیافت میں سب کو کھانا کھلایا اور ضرب کے سوال حل کیے۔ اس نے سیکھا کہ ضد کرنے سے کچھ نہیں ملتا، محنت کرنی چاہیے۔ وہ اپنی کلاس کا ضلع بھر کا اول آگیا۔",
        moral: "✨ سبق: ضد چھوڑ کر محنت کرو تو کامیابی ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1OQ0Wc6lLOpCt5N6f2VZgCobT3KhlNZTe&sz=w1000","https://drive.google.com/thumbnail?id=1J0sRpd66csg53Q5JGR-0YWdeltWkVKnt&sz=w1000","https://drive.google.com/thumbnail?id=1tq9qZ5qmfhNj_gTm_SH6L59JDvoMUfX0&sz=w1000","https://drive.google.com/thumbnail?id=1Ziy0D5zVmN6vhpjIBVzv4PNQ8nG14kyb&sz=w1000"]
    },
    tah: {
        title: "ط کی کہانی",
        text: "طارق ایک طالب علم تھا۔ اس نے طوطے کو طوق پہنایا اور طبلہ بجانا سیکھا۔ اس کی طاقت سے سب حیران تھے۔ اس نے طمانیت سے سب کو موسیقی سنائی اور طیارے کی طرح اڑان بھری۔",
        moral: "✨ سبق: محنت سے ہنر سیکھو تو کامیابی ضرور ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1Usyaszm_W_F0-nGPIcMJYawDGzj2wTkL&sz=w1000","https://drive.google.com/thumbnail?id=1TdMQB88snHYqyOJtethYmyL87rtDzq1W&sz=w1000","https://drive.google.com/thumbnail?id=15N-bVFRwVx8kEiXkw39wVDAhbId2h96A&sz=w1000","https://drive.google.com/thumbnail?id=1Kicp1ii5wc9ZJDg3lDrQErDOw_qi5Dwa&sz=w1000","https://drive.google.com/thumbnail?id=14YRqAFJCGRfmIKOJDuJFPl5DyPheTN0C&sz=w1000","https://drive.google.com/thumbnail?id=1BqJvfxVzppJxc3qXXfM78VjCeETpGN2M&sz=w1000"]
    },
    zah: {
        title: "ظ کی کہانی",
        text: "ظہیر بہت ظریف اور ذہین تھا۔ اس نے ظہر کی نماز کے بعد ظروف دھوئے اور ظاہر کیا کہ وہ کتنا محنتی ہے۔ اس کے دادا نے اسے ظفر کی دعا دی۔ ظہیر نے سیکھا کہ ظاہری اور باطنی دونوں طرح صاف رہنا چاہیے۔",
        moral: "✨ سبق: ظاہری اور باطنی صفائی انسان کو کامیاب بناتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1OULQpu0kA8aUZCcs3kImlHTF38dNrAWM&sz=w1000","https://drive.google.com/thumbnail?id=18Cj9yIwJEXDgzGMGEj82g-Pl8ANjITIB&sz=w1000","https://drive.google.com/thumbnail?id=1utPzNp8qbzN74A4JH-rWMkIngPcAqn6X&sz=w1000"]
    },
    ain: {
        title: "ع کی کہانی",
        text: "عابدہ ایک عورت تھی جو عبادت گزار تھی۔ اس نے عینک پہن کر عقاب کو دیکھا اور عمارت کی چھت سے عید کا چاند دیکھا۔ اس نے اللہ کا شکر ادا کیا اور عید کی خوشی سب میں بانٹ دی۔ اس کی عاجزی سے سب خوش تھے۔",
        moral: "✨ سبق: عاجزی اور عبادت سے دل کو سکون ملتا ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1qPiC5aGvSr59A_HUe1bmtdQUwnGyL7Am&sz=w1000","https://drive.google.com/thumbnail?id=18AUmhEV6KKeRJO_d6SZHFA9qTBwkAvjB&sz=w1000","https://drive.google.com/thumbnail?id=1nZSgIWoseVM5M3yU3q4pf-LHV0Ncvn1n&sz=w1000","https://drive.google.com/thumbnail?id=19MJXcqywk1ecYi4ftMg2TDWh6Dw43TKS&sz=w1000","https://drive.google.com/thumbnail?id=1SHvuCkDRkNkN4dHlOJoaDLzYfUCUa1EG&sz=w1000","https://drive.google.com/thumbnail?id=1F-bf-nm1J4t9NsVCf4waP_Djj0dkPynN&sz=w1000"]
    },
    ghain: {
        title: "غ کی کہانی",
        text: "غلام ایک غریب لڑکا تھا۔ اس نے غار میں غبارے اڑائے اور غزال کو بچایا۔ اس نے غصہ کرنا چھوڑ دیا اور سب سے غور سے بات کرنے لگا۔ اس کی غربت ختم ہو گئی اور وہ غنی بن گیا۔",
        moral: "✨ سبق: غصہ چھوڑ دو اور صبر کرو تو کامیابی ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1nkstxswRZj9FHTluYVQGzeg5X10_CLgH&sz=w1000","https://drive.google.com/thumbnail?id=1Ucn4lLa8K9z7ojj7498GlaHaI56i0nTH&sz=w1000","https://drive.google.com/thumbnail?id=11BmVQ6NFvWRURSVTkiu3UHYR9p6sgOws&sz=w1000","https://drive.google.com/thumbnail?id=189GFa1Y7_3-PeWGQYalGk1YiuoMzG5dl&sz=w1000","https://drive.google.com/thumbnail?id=1O7qugSkRWO_dEaIEtqwlHTE0GLqylzGz&sz=w1000","https://drive.google.com/thumbnail?id=1GvAGf_dGZGTQeMCXPUSB5GU0vw0a4Zox&sz=w1000"]
    },
    fe: {
        title: "ف کی کہانی",
        text: "فاطمہ ایک فرمانبردار لڑکی تھی۔ اس نے فلم دیکھ کر فوج کے بارے میں جانا۔ اس نے فقیروں کی خدمت کی اور فوارے کے پاس بیٹھ کر قرآن پڑھا۔ اس کی فراست سے سب حیران تھے۔",
        moral: "✨ سبق: فرمانبرداری اور فراست سے زندگی سنور جاتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1SEyOHC_Z7RNwwDejAl-CZj5o95eeERnk&sz=w1000","https://drive.google.com/thumbnail?id=1e2r_rVNd8EbrtwK0Qgt04sNQI1VHr6mM&sz=w1000","https://drive.google.com/thumbnail?id=1Q633UiT3x30cZpfh4knlRp2EwYohmheF&sz=w1000","https://drive.google.com/thumbnail?id=1yndSkpCzqVoBcPBGQuNvswjT5f0loN5h&sz=w1000","https://drive.google.com/thumbnail?id=15nF4hKK-W8M25uaqC6OcNWoFDGC3XL0e&sz=w1000","https://drive.google.com/thumbnail?id=17zT2v1rusHo6c8fPFEoiivcp4W_AbzW9&sz=w1000"]
    },
    qaf: {
        title: "ق کی کہانی",
        text: "قاسم ایک قاری تھا۔ اس نے قرآن مجید پڑھا اور قلم سے لکھنا سیکھا۔ اس نے قدم بڑھا کر قبرستان میں جا کر فاتحہ خوانی کی۔ اس نے قید سے آزادی کی دعا مانگی اور قریب کے لوگوں کی مدد کی۔",
        moral: "✨ سبق: قربانی اور قناعت سے دل کو سکون ملتا ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1WFPLaSIQps9PSO4LkQsSIoMzixLbD3tI&sz=w1000","https://drive.google.com/thumbnail?id=1EYGSFq9Y5AB7qCG1xnbQmJK0IyjasAxQ&sz=w1000","https://drive.google.com/thumbnail?id=1RbgqqmkDJ7UiH3v2VMwQq6BdWxOsePC3&sz=w1000","https://drive.google.com/thumbnail?id=1yxQixH7ruifqB-5EwmbR0jHHGcgvm57a&sz=w1000","https://drive.google.com/thumbnail?id=1nm88JKkFPVjdJ_h4TCr0G8wD6yqQVgTF&sz=w1000"]
    },
    kaf: {
        title: "ک کی کہانی",
        text: "کامران ایک کسان تھا۔ اس نے کھیت میں کپاس اگائی اور کتابوں سے علم حاصل کیا۔ کچھوا اس کا دوست تھا۔ اس نے کاغذ پر کہانی لکھی اور کبوتر کے ذریعے بھیجی۔ اس کی کاوشوں سے سب خوش تھے۔",
        moral: "✨ سبق: کاوش اور محنت سے کامیابی ضرور ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1dncMYa-Ox8T0Gk7tNfzgbMtLjBjbkucp&sz=w1000","https://drive.google.com/thumbnail?id=1c31h1f4q8Ku_rNS0aqfyfWbl9aXeS2Wh&sz=w1000","https://drive.google.com/thumbnail?id=1OfTuzfsyK12Jpx_beAz7JEUXgXnf5uXO&sz=w1000","https://drive.google.com/thumbnail?id=1fs4BPhei7PPQO2PxjGvpraKouUoSB960&sz=w1000","https://drive.google.com/thumbnail?id=1KIQ55LEmJ1qina2KytzenKT6p2_yhxEr&sz=w1000","https://drive.google.com/thumbnail?id=1vmcT04uKD14KxNcZ40Cgu9OhJpPQ7wUG&sz=w1000"]
    },
    gaf: {
        title: "گ کی کہانی",
        text: "گلشن ایک خوبصورت باغ تھا۔ وہاں گدھا اور گھوڑا دوست تھے۔ انہوں نے گھاس پر گیند سے کھیل کھیلا۔ گنبد کے نیچے گلاس میں پانی پیا۔ ان کی گونجتی ہوئی آوازوں سے سب خوش تھے۔",
        moral: "✨ سبق: گھل مل کر رہنا اور گپ شپ کرنا دوستی بڑھاتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1OWWqzTpi4Bp2m1huGZDJjO-YAcHBnfAu&sz=w1000","https://drive.google.com/thumbnail?id=1_9B6U9qjHxttAVZvQ9ISRgvAz76duonO&sz=w1000","https://drive.google.com/thumbnail?id=1q1eZ1Yb1FoX_loE-YxoT_Hi-eqpM7qKA&sz=w1000","https://drive.google.com/thumbnail?id=1zBhNTGfRdkmrCbQ5Gs9exHhLuDZ5sN5p&sz=w1000","https://drive.google.com/thumbnail?id=1sBai-PjHCdCqlh2jOHqwUgzVmMp4D-cJ&sz=w1000","https://drive.google.com/thumbnail?id=1RvGCrPZa8mIyamsTovuVBWX5r_yyzIHf&sz=w1000"]
    },
    lam: {
        title: "ل کی کہانی",
        text: "لالہ ایک لاڈلی بچی تھی۔ اس نے لکڑی سے لڈو بنائے اور لومڑی کو بچایا۔ اس نے لذیذ کھانا پکایا اور لاکھوں میں سے ایک بن گئی۔ اس کی لیاقت سے سب خوش تھے۔",
        moral: "✨ سبق: لگن اور محبت سے کام کرو تو کامیابی ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1bftsVJJujHe_5pgAavymJqusHreg8Tb8&sz=w1000","https://drive.google.com/thumbnail?id=1qKunJ3GSDRoL_cz7DlBb4uaW4fPLTFKh&sz=w1000","https://drive.google.com/thumbnail?id=1oH7N_qI3Oe7M-AvYrxovEn8H6iAydvz3&sz=w1000","https://drive.google.com/thumbnail?id=1ysuFivfW38gYvb9aY7Kh7HjPfzTZtK68&sz=w1000","https://drive.google.com/thumbnail?id=12NO44mEQAgNyRNKXhcDrx7uYSje9JYao&sz=w1000","https://drive.google.com/thumbnail?id=1duPoyfADjUa1HnxE63q2NC8U1Z3lhXgW&sz=w1000"]
    },
    meem: {
        title: "م کی کہانی",
        text: "مریم ایک محنتی لڑکی تھی۔ اس نے مکڑی سے جال بنا کر مچھلی پکڑی۔ اس نے مچھر کو بچایا اور موم بتی سے روشنی کی۔ مور نے ناچ دکھایا اور مگرمچھ نے سب کو بچایا۔",
        moral: "✨ سبق: محنت اور محبت سے سب کچھ ممکن ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1BAeBBWGJzpU4EK0VxuTUYCN-insEhVyB&sz=w1000","https://drive.google.com/thumbnail?id=1foGRhSNFqoF4NPlWA1NyhdnomQc2SY7c&sz=w1000","https://drive.google.com/thumbnail?id=1mfrQ6toeK-Gca08AdsMUBHIayZCzMpsW&sz=w1000","https://drive.google.com/thumbnail?id=10G9jcpEDsWMNjgumLiE0ScG3K8n2tkrK&sz=w1000","https://drive.google.com/thumbnail?id=1_ZLWe07rb7LlGblQLLOm_DDohtqBBhVc&sz=w1000","https://drive.google.com/thumbnail?id=1GecDeYbvm9qEtcqi8FxPjuBWO7tG7OEN&sz=w1000"]
    },
    noon: {
        title: "ن کی کہانی",
        text: "نشا ننھی سی بچی تھی۔ اس نے ناخن کاٹے اور ناک صاف کی۔ اس نے نمک نل سے پانی میں ڈالا اور نب سے ناریل توڑا۔ اس نے نرمی سے سب سے بات کی اور نہایت ہوشیاری سے کام لیا۔",
        moral: "✨ سبق: نرمی اور نزاکت سے سب کی محبت ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1xG4NLys54lNLYO8vdTDJf1BDwcDf7NaJ&sz=w1000","https://drive.google.com/thumbnail?id=1JzeI25hzugfWYn3T_F54GcEK2Oe_Soco&sz=w1000","https://drive.google.com/thumbnail?id=1LdOaIy7IgiA1tclkSzK47rr76Bqyl8FD&sz=w1000","https://drive.google.com/thumbnail?id=1SxX0BCwPMynjMS_Vjo7l0hRNudRsXyES&sz=w1000","https://drive.google.com/thumbnail?id=1mM3jHLPoepmDzVYyIz1GG0IVEN3LL9ns&sz=w1000","https://drive.google.com/thumbnail?id=1tIqpXfZIB5-5Xie90zurCk09p203j8Xg&sz=w1000"]
    },
    vav: {
        title: "و کی کہانی",
        text: "وسیم ایک وکیل تھا۔ اس نے ویسٹ کوٹ پہنا اور ورق پر مقدمہ لکھا۔ وہیل مچھلی نے اسے وادی میں بچایا۔ اس نے وعدہ کیا کہ وہ ہمیشہ انصاف کرے گا۔",
        moral: "✨ سبق: وعدے کا پورا کرنا اور انصاف کرنا بہت ضروری ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1nLc0dnqvPOE0tvo2LUMGkd1K9bTx-PWU&sz=w1000","https://drive.google.com/thumbnail?id=1mwIPBT_ldRm-jbotmAwmnBR3i7YEiQiB&sz=w1000","https://drive.google.com/thumbnail?id=1hB-biOVfjRCnwirGwWdwaxSXelqwl5B7&sz=w1000","https://drive.google.com/thumbnail?id=1OQsycvWzHHo_ZpXzhJsdZ2hKHG4U1uDu&sz=w1000","https://drive.google.com/thumbnail?id=1pU-LsgiCbfddiyJWsPQ2FH2YM8DicFvE&sz=w1000","https://drive.google.com/thumbnail?id=1daZmJxSHx7BHG2fxumQhbMIPx7p26ONr&sz=w1000"]
    },
    he: {
        title: "ہ کی کہانی",
        text: "ہانیہ ایک ہونہار لڑکی تھی۔ اس نے ہاتھی کو ہار پہنایا اور ہرن کو ہڈی چبائی۔ اس نے ہسپتال جا کر مریضوں کی ہمت بڑھائی۔ اس کی ہمدردی سے سب خوش تھے۔",
        moral: "✨ سبق: ہمدردی اور ہمت سے دوسروں کی مدد کرو۔",
        images: ["https://drive.google.com/thumbnail?id=1yThdbF0QIxQV6mhRWG_oR6zAjKts4aXk&sz=w1000","https://drive.google.com/thumbnail?id=1naD0DJQdBuA_FT4u5fZb99lnk9q3bH2Z&sz=w1000","https://drive.google.com/thumbnail?id=1vvNnJfmOR21sPqDb8R54hkf0a0V7nzEW&sz=w1000","https://drive.google.com/thumbnail?id=1xXh8_XIm0Kv2efAeP8dGzJyhYCuSW-Rc&sz=w1000","https://drive.google.com/thumbnail?id=1F5MEhwGW_HdY8caPUdiLXw8o_5E4x2Q1&sz=w1000","https://drive.google.com/thumbnail?id=1wCyYHEwFpXmvBMd8IPNPzOWm-Mkp8z-L&sz=w1000"]
    },
    hamzah: {
        title: "ء کی کہانی",
        text: "آمنہ ایک امانت دار عورت تھی۔ اس نے اپنے بچوں کو سکھایا کہ امانت کا خیال رکھنا چاہیے۔ اس نے آہستگی سے سب سے بات کی اور آؤ بھگت سے کام لیا۔ اس کی آواز میں اثر تھا۔",
        moral: "✨ سبق: امانت داری اور آہستگی سے کام لو تو کامیابی ملتی ہے۔",
        images: ["https://drive.google.com/thumbnail?id=1Ch6G8Q01soUy1NladS7rjMlsO3tckvGD&sz=w1000","https://drive.google.com/thumbnail?id=1PqycHafOuSsZXXIeCndwoeZ6K1F-bOgq&sz=w1000","https://drive.google.com/thumbnail?id=13vtGg36N4NH62dkZ2U8PBy7vIhvSh5WP&sz=w1000"]
    },
    ye: {
        title: "ی کی کہانی",
        text: "یاسر ایک یتیم لڑکا تھا۔ اس نے یاک پال کر دودھ بیچا۔ اس نے یاقوت پتھر سے یخنی پکائی اور یوگا کر کے صحت مند رہا۔ اس کی یاری سب سے تھی۔",
        moral: "✨ سبق: یقین اور یاری سے مشکل کام بھی آسان ہو جاتے ہیں۔",
        images: ["https://drive.google.com/thumbnail?id=1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_&sz=w1000","https://drive.google.com/thumbnail?id=1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA&sz=w1000","https://drive.google.com/thumbnail?id=1crADm-lQIFdM743nuM8dMwPXajYhIXJI&sz=w1000","https://drive.google.com/thumbnail?id=1vwlLaUsf3z4s-LHV27tTA2oJAdanCrFn&sz=w1000","https://drive.google.com/thumbnail?id=1VgbKGs0M585Pgg0Rqj3wo0TwX_nyk2oK&sz=w1000"]
    },
    ye_barree: {
        title: "ے کی کہانی",
        text: "یسریٰ ایک ے سے شروع ہونے والی لڑکی تھی۔ اس نے اپنے دوستوں کے ساتھ میلہ دیکھا اور ے کے الفاظ سیکھے۔ اس نے اپنے استاد کا شکریہ ادا کیا اور کہا کہ ے بہت خوبصورت حرف ہے۔",
        moral: "✨ سبق: اپنے استاد کا شکریہ ادا کرو اور نئے الفاظ سیکھتے رہو۔",
        images: ["https://drive.google.com/thumbnail?id=1x8N8Rg8i4-QwGQSgD4S8HSIOFKxm94u_&sz=w1000","https://drive.google.com/thumbnail?id=1b6u115NUxGSDrZ5OuDsR3pzUocDbydhA&sz=w1000","https://drive.google.com/thumbnail?id=1crADm-lQIFdM743nuM8dMwPXajYhIXJI&sz=w1000"]
    }
};

// ============================================
// SECTION 2: ALPHABET LIST (37 HURUF)
// ============================================
const alphabetList = [
    { id: 'alif', name: 'الف' }, { id: 'alif-mad-aa', name: 'آ' },
    { id: 'bay', name: 'ب' }, { id: 'pay', name: 'پ' }, { id: 'tay', name: 'ت' },
    { id: 'ttay', name: 'ٹ' }, { id: 'say', name: 'ث' }, { id: 'jeem', name: 'ج' },
    { id: 'chay', name: 'چ' }, { id: 'hay', name: 'ح' }, { id: 'kha', name: 'خ' },
    { id: 'dal', name: 'د' }, { id: 'dhal', name: 'ڈ' }, { id: 'zaal', name: 'ذ' },
    { id: 'ray', name: 'ر' }, { id: 'rray', name: 'ڑ' }, { id: 'zay', name: 'ز' },
    { id: 'seen', name: 'س' }, { id: 'sheen', name: 'ش' }, { id: 'sad', name: 'ص' },
    { id: 'zad', name: 'ض' }, { id: 'tah', name: 'ط' }, { id: 'zah', name: 'ظ' },
    { id: 'ain', name: 'ع' }, { id: 'ghain', name: 'غ' }, { id: 'fe', name: 'ف' },
    { id: 'qaf', name: 'ق' }, { id: 'kaf', name: 'ک' }, { id: 'gaf', name: 'گ' },
    { id: 'lam', name: 'ل' }, { id: 'meem', name: 'م' }, { id: 'noon', name: 'ن' },
    { id: 'vav', name: 'و' }, { id: 'he', name: 'ہ' }, { id: 'hamzah', name: 'ء' },
    { id: 'ye', name: 'ی' }, { id: 'ye_barree', name: 'ے' }
];

// ============================================
// SECTION 3: 30 LEARNING WAYS LIST
// ============================================
const learningWays = [
    { id: 1, name: "Flashcards", icon: "fa-layer-group", desc: "تصویر دیکھیں اور حرف پہچانیں", type: "flashcards" },
    { id: 2, name: "Match Pair", icon: "fa-puzzle-piece", desc: "حرف کو صحیح تصویر سے جوڑیں", type: "matchPair" },
    { id: 3, name: "Memory Game", icon: "fa-brain", desc: "تصاویر کے جوڑے ملائیں", type: "memoryGame" },
    { id: 4, name: "Quiz", icon: "fa-question-circle", desc: "تصویر دیکھ کر سوالات کے جواب دیں", type: "quiz" },
    { id: 5, name: "Slideshow", icon: "fa-film", desc: "خودکار سلائیڈ شو دیکھیں", type: "slideshow" },
    { id: 6, name: "Odd One Out", icon: "fa-shapes", desc: "مختلف تصویر پہچانیں", type: "oddOneOut" },
    { id: 7, name: "True or False", icon: "fa-check-double", desc: "بیان صحیح ہے یا غلط", type: "trueFalse" },
    { id: 8, name: "Drag & Drop", icon: "fa-hand-peace", desc: "تصویر کو صحیح جگہ پر رکھیں", type: "dragDrop" },
    { id: 9, name: "Picture Hunt", icon: "fa-binoculars", desc: "چھپی ہوئی تصویر ڈھونڈیں", type: "pictureHunt" },
    { id: 10, name: "Describe Picture", icon: "fa-microphone-alt", desc: "تصویر دیکھ کر بتائیں", type: "describe" },
    { id: 11, name: "Coloring", icon: "fa-palette", desc: "تصویر کو رنگ بھریں", type: "coloring" },
    { id: 12, name: "Zoom & Explore", icon: "fa-search-plus", desc: "تصویر پر زوم کریں", type: "zoom" },
    { id: 13, name: "Label It", icon: "fa-tag", desc: "تصویر میں چیزوں کے نام لکھیں", type: "label" },
    { id: 14, name: "Story Builder", icon: "fa-book-open", desc: "اپنی کہانی بنائیں", type: "storyBuilder" },
    { id: 15, name: "Voice Recognition", icon: "fa-microphone", desc: "بولیں اور سیکھیں", type: "voice" },
    { id: 16, name: "Speed Challenge", icon: "fa-stopwatch", desc: "وقت کے خلاف کھیلیں", type: "speed" },
    { id: 17, name: "Spin Wheel", icon: "fa-chart-simple", desc: "وہیل گھمائیں اور سیکھیں", type: "spin" },
    { id: 18, name: "Bingo Game", icon: "fa-border-all", desc: "بنگو کھیلیں", type: "bingo" },
    { id: 19, name: "Jigsaw Puzzle", icon: "fa-puzzle-piece", desc: "تصویر کے ٹکڑے جوڑیں", type: "puzzle" },
    { id: 20, name: "Hidden Picture", icon: "fa-eye-slash", desc: "چھپی تصویر کھولیں", type: "hidden" },
    { id: 21, name: "Story Dice", icon: "fa-dice", desc: "ڈائس سے کہانی بنائیں", type: "dice" },
    { id: 22, name: "Sort It", icon: "fa-table-list", desc: "تصاویر کو ترتیب دیں", type: "sort" },
    { id: 23, name: "Comic Maker", icon: "fa-stamp", desc: "کارٹون بنائیں", type: "comic" },
    { id: 24, name: "Complete Scene", icon: "fa-image", desc: "نامکمل تصویر مکمل کریں", type: "complete" },
    { id: 25, name: "What's Next?", icon: "fa-forward", desc: "اگلی تصویر پہچانیں", type: "next" },
    { id: 26, name: "Guess Zoom", icon: "fa-magnifying-glass", desc: "زوم شدہ تصویر پہچانیں", type: "guess" },
    { id: 27, name: "Trace Letter", icon: "fa-pen-fancy", desc: "حرف کو ٹریس کریں", type: "trace" },
    { id: 28, name: "Emoji Story", icon: "fa-smile-wink", desc: "ایموجی سے کہانی بنائیں", type: "emoji" },
    { id: 29, name: "Story Order", icon: "fa-sort-amount-down", desc: "ترتیب سے لگائیں", type: "order" },
    { id: 30, name: "Spot Letter", icon: "fa-search", desc: "چھپا حرف ڈھونڈیں", type: "spot" }
];

// ============================================
// SECTION 4: GLOBAL VARIABLES
// ============================================
let currentLetter = 'alif';
let usageCount = 0;
let currentQuizScore = 0;
let currentQuizAnswered = false;

// ============================================
// SECTION 5: INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    generateAlphabetButtons();
    generateWaysGrid();
    loadStory('alif');
    loadUsageCount();
    loadReactions();
    setupEventListeners();
    applyDarkMode();
    console.log('✅ Magicrills Urdu Alphabet Stories - Loaded Successfully with 30 Ways!');
});

// ============================================
// SECTION 6: GENERATE ALPHABET BUTTONS
// ============================================
function generateAlphabetButtons() {
    const container = document.getElementById('alphabetButtons');
    if (!container) return;
    
    container.innerHTML = alphabetList.map(letter => `
        <button class="alphabet-btn" data-letter="${letter.id}">${letter.name}</button>
    `).join('');
    
    document.querySelectorAll('.alphabet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLetter = btn.dataset.letter;
            loadStory(currentLetter);
            closeWayModal();
        });
    });
}

// ============================================
// SECTION 7: GENERATE WAYS GRID
// ============================================
function generateWaysGrid() {
    const container = document.getElementById('waysGrid');
    if (!container) return;
    
    container.innerHTML = learningWays.map(way => `
        <div class="way-card" data-way-id="${way.id}" data-way-type="${way.type}">
            <i class="fas ${way.icon}"></i>
            <h4>${way.name}</h4>
            <p>${way.desc}</p>
        </div>
    `).join('');
    
    document.querySelectorAll('.way-card').forEach(card => {
        card.addEventListener('click', () => {
            const way = learningWays.find(w => w.id === parseInt(card.dataset.wayId));
            if (way) openLearningWay(way);
        });
    });
}

// ============================================
// SECTION 8: LOAD STORY
// ============================================
function loadStory(letter) {
    const data = storyData[letter];
    if (!data) return;
    
    const titleEl = document.getElementById('storyTitle');
    const textEl = document.getElementById('storyText');
    const moralEl = document.getElementById('storyMoral');
    const imagesContainer = document.getElementById('storyImages');
    
    if (titleEl) titleEl.innerText = data.title;
    if (textEl) textEl.innerHTML = `<p>${data.text}</p>`;
    if (moralEl) moralEl.innerHTML = `<i class="fas fa-star-of-life"></i> ${data.moral}`;
    
    if (imagesContainer) {
        imagesContainer.innerHTML = '';
        data.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = data.title;
            img.onclick = () => openImageModal(imgSrc);
            imagesContainer.appendChild(img);
        });
    }
    
    incrementUsage();
}

// ============================================
// SECTION 9: OPEN LEARNING WAY (SWITCH CASE - ALL 30)
// ============================================
function openLearningWay(way) {
    const modal = document.getElementById('wayModal');
    if (!modal) return;
    
    const titleEl = document.getElementById('wayModalTitle');
    const bodyEl = document.getElementById('wayModalBody');
    if (!titleEl || !bodyEl) return;
    
    titleEl.innerHTML = `<i class="fas ${way.icon}"></i> ${way.name}`;
    
    const data = storyData[currentLetter];
    if (!data) return;
    
    switch(way.type) {
        case 'flashcards':
            renderFlashcards(bodyEl, data.images);
            break;
        case 'matchPair':
            renderMatchPair(bodyEl, data.images);
            break;
        case 'memoryGame':
            renderMemoryGame(bodyEl, data.images);
            break;
        case 'quiz':
            renderQuiz(bodyEl, data.images);
            break;
        case 'slideshow':
            renderSlideshow(bodyEl, data.images);
            break;
        case 'oddOneOut':
            renderOddOneOut(bodyEl, data.images);
            break;
        case 'trueFalse':
            renderTrueFalse(bodyEl, data.images);
            break;
        case 'dragDrop':
            renderDragDrop(bodyEl, data.images);
            break;
        case 'pictureHunt':
            renderPictureHunt(bodyEl, data.images);
            break;
        case 'describe':
            renderDescribe(bodyEl, data.images);
            break;
        case 'coloring':
            renderColoring(bodyEl, data.images);
            break;
        case 'zoom':
            renderZoom(bodyEl, data.images);
            break;
        case 'label':
            renderLabel(bodyEl, data.images);
            break;
        case 'storyBuilder':
            renderStoryBuilder(bodyEl, data.images);
            break;
        case 'voice':
            renderVoice(bodyEl, data.images);
            break;
        case 'speed':
            renderSpeed(bodyEl, data.images);
            break;
        case 'spin':
            renderSpin(bodyEl, data.images);
            break;
        case 'bingo':
            renderBingo(bodyEl, data.images);
            break;
        case 'puzzle':
            renderPuzzle(bodyEl, data.images);
            break;
        case 'hidden':
            renderHidden(bodyEl, data.images);
            break;
        case 'dice':
            renderStoryDice(bodyEl, data.images);
            break;
        case 'sort':
            renderSort(bodyEl, data.images);
            break;
        case 'comic':
            renderComic(bodyEl, data.images);
            break;
        case 'complete':
            renderCompleteScene(bodyEl, data.images);
            break;
        case 'next':
            renderWhatsNext(bodyEl, data.images);
            break;
        case 'guess':
            renderGuessZoom(bodyEl, data.images);
            break;
        case 'trace':
            renderTrace(bodyEl, data.images);
            break;
        case 'emoji':
            renderEmojiStory(bodyEl, data.images);
            break;
        case 'order':
            renderStoryOrder(bodyEl, data.images);
            break;
        case 'spot':
            renderSpotLetter(bodyEl, data.images);
            break;

        default:
            bodyEl.innerHTML = `<div style="text-align:center;padding:40px"><i class="fas fa-cogs" style="font-size:3rem"></i><p style="margin-top:20px">${way.name} جلد آرہا ہے</p><button onclick="closeWayModal()" style="margin-top:20px;padding:10px 20px;background:var(--secondary-color);color:white;border:none;border-radius:10px">بند کریں</button></div>`;
    }
    
    modal.style.display = 'block';
}

// ============================================
// SECTION 10: WAY 1 - FLASHCARDS
// ============================================
function renderFlashcards(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    let currentIndex = 0;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <div style="margin: 20px auto; max-width: 350px; cursor: pointer;">
                <img id="flashcardImg" src="${images[0]}" style="width: 100%; height: auto; max-height: 300px; object-fit: contain; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <button id="flashPrev" style="padding: 12px 25px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 30px; cursor: pointer;">
                    <i class="fas fa-arrow-right"></i> پچھلا
                </button>
                <button id="flashNext" style="padding: 12px 25px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 30px; cursor: pointer;">
                    اگلا <i class="fas fa-arrow-left"></i>
                </button>
            </div>
            <p id="flashCounter" style="font-size: 1rem;">تصویر 1 / ${images.length}</p>
            <button onclick="closeWayModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const img = document.getElementById('flashcardImg');
    const prevBtn = document.getElementById('flashPrev');
    const nextBtn = document.getElementById('flashNext');
    const counter = document.getElementById('flashCounter');
    
    const update = () => {
        img.src = images[currentIndex];
        counter.textContent = `تصویر ${currentIndex + 1} / ${images.length}`;
    };
    
    if (prevBtn) prevBtn.onclick = () => { currentIndex = (currentIndex - 1 + images.length) % images.length; update(); showToast(`تصویر ${currentIndex + 1}`); };
    if (nextBtn) nextBtn.onclick = () => { currentIndex = (currentIndex + 1) % images.length; update(); showToast(`تصویر ${currentIndex + 1}`); };
    if (img) img.onclick = () => openImageModal(images[currentIndex]);
    
    update();
}

// ============================================
// SECTION 11: WAY 2 - MATCH PAIR
// ============================================
function renderMatchPair(container, images) {
    if (!images || images.length < 2) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 2 تصاویر درکار ہیں</div>';
        return;
    }
    
    const matchImages = images.slice(0, 4);
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    
    let selectedLetter = null;
    let selectedImage = null;
    let matches = 0;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <div class="match-pairs" style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; margin: 20px 0;">
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${matchImages.map((_, i) => `<div class="match-letter" data-idx="${i}" style="padding: 15px 25px; background: var(--bg-primary, #f0f0f0); border-radius: 10px; cursor: pointer; font-size: 1.3rem; text-align: center;">${letterName}</div>`).join('')}
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${matchImages.map((img, i) => `<div class="match-image" data-idx="${i}" style="background: var(--bg-primary, #f0f0f0); padding: 10px; border-radius: 10px; cursor: pointer;"><img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"></div>`).join('')}
                </div>
            </div>
            <div id="matchStatus" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const statusDiv = container.querySelector('#matchStatus');
    
    const checkMatch = () => {
        if (selectedLetter !== null && selectedImage !== null) {
            const letterDiv = container.querySelector(`.match-letter[data-idx="${selectedLetter}"]`);
            const imageDiv = container.querySelector(`.match-image[data-idx="${selectedImage}"]`);
            
            if (letterDiv && imageDiv && !letterDiv.classList.contains('matched')) {
                letterDiv.classList.add('matched');
                imageDiv.classList.add('matched');
                matches++;
                statusDiv.innerHTML = `<span style="color: green;">✅ صحیح! ${matches}/${matchImages.length} جوڑے مل گئے</span>`;
                showToast('صحیح جوڑا!');
                
                if (matches === matchImages.length) {
                    statusDiv.innerHTML = `<span style="color: gold; font-size: 1.2rem;">🎉 مبارک ہو! آپ نے تمام جوڑے ملادیے! 🎉</span>`;
                    showFloatingNotification('واہ! آپ جیت گئے!');
                }
            }
            selectedLetter = null;
            selectedImage = null;
        }
    };
    
    container.querySelectorAll('.match-letter').forEach(el => {
        el.onclick = () => {
            if (!el.classList.contains('matched')) {
                container.querySelectorAll('.match-letter').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                selectedLetter = parseInt(el.dataset.idx);
                checkMatch();
            }
        };
    });
    
    container.querySelectorAll('.match-image').forEach(el => {
        el.onclick = () => {
            if (!el.classList.contains('matched')) {
                container.querySelectorAll('.match-image').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                selectedImage = parseInt(el.dataset.idx);
                checkMatch();
            }
        };
    });
}

// ============================================
// SECTION 12: WAY 3 - MEMORY GAME
// ============================================
function renderMemoryGame(container, images) {
    if (!images || images.length < 2) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 2 تصاویر درکار ہیں</div>';
        return;
    }
    
    let gameImages = [...images.slice(0, 4), ...images.slice(0, 4)];
    for (let i = gameImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameImages[i], gameImages[j]] = [gameImages[j], gameImages[i]];
    }
    
    let flipped = [];
    let matched = [];
    let lock = false;
    
    const render = () => {
        container.innerHTML = `
            <div style="text-align: center;">
                <div class="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 500px; margin: 20px auto;"></div>
                <div id="memoryStatus" style="margin: 15px 0;"></div>
                <button id="resetMemory" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; margin: 5px; cursor: pointer;">دوبارہ شروع کریں</button>
                <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; margin: 5px; cursor: pointer;">بند کریں</button>
            </div>
        `;
        
        const grid = container.querySelector('.memory-grid');
        const statusDiv = container.querySelector('#memoryStatus');
        
        if (grid) {
            grid.innerHTML = gameImages.map((img, i) => `
                <div class="memory-card ${matched.includes(i) ? 'matched' : ''} ${flipped.includes(i) ? 'flipped' : ''}" data-index="${i}" style="aspect-ratio: 1; background: var(--primary-color, #3498db); border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                    ${flipped.includes(i) || matched.includes(i) ? `<img src="${img}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : '?'}
                </div>
            `).join('');
        }
        
        document.querySelectorAll('.memory-card').forEach(card => {
            card.onclick = () => {
                if (lock || matched.includes(parseInt(card.dataset.index)) || flipped.includes(parseInt(card.dataset.index))) return;
                const idx = parseInt(card.dataset.index);
                flipped.push(idx);
                if (flipped.length === 2) {
                    lock = true;
                    const [i1, i2] = flipped;
                    if (gameImages[i1] === gameImages[i2]) {
                        matched.push(i1, i2);
                        flipped = [];
                        if (statusDiv) statusDiv.innerHTML = '<span style="color: green;">✅ جوڑا مل گیا!</span>';
                        if (matched.length === gameImages.length && statusDiv) statusDiv.innerHTML = '<span style="color: gold; font-size: 1.2rem;">🎉 مبارک ہو! آپ جیت گئے! 🎉</span>';
                        lock = false;
                        render();
                    } else {
                        setTimeout(() => { flipped = []; lock = false; render(); }, 1000);
                        if (statusDiv) statusDiv.innerHTML = '<span style="color: red;">❌ دوبارہ کوشش کریں</span>';
                    }
                }
                render();
            };
        });
        
        const resetBtn = container.querySelector('#resetMemory');
        if (resetBtn) {
            resetBtn.onclick = () => {
                gameImages = [...images.slice(0, 4), ...images.slice(0, 4)];
                for (let i = gameImages.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [gameImages[i], gameImages[j]] = [gameImages[j], gameImages[i]];
                }
                flipped = [];
                matched = [];
                lock = false;
                render();
                showToast('گیم دوبارہ شروع ہوگئی');
            };
        }
    };
    
    render();
}

// ============================================
// SECTION 13: WAY 4 - QUIZ
// ============================================
function renderQuiz(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const correctAnswer = currentLetterObj ? currentLetterObj.name : '?';
    const otherLetters = alphabetList.filter(l => l.id !== currentLetter).slice(0, 3).map(l => l.name);
    
    let currentImageIndex = 0;
    let score = 0;
    let answered = false;
    
    const loadQuestion = () => {
        const options = [correctAnswer, ...otherLetters];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        container.innerHTML = `
            <div style="text-align: center;">
                <img id="quizImg" src="${images[currentImageIndex % images.length]}" style="max-width: 250px; border-radius: 15px; margin-bottom: 20px;">
                <h4>یہ تصویر کس حرف کی ہے؟</h4>
                <div id="quizOptions" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 20px auto;"></div>
                <div id="quizScore" style="margin: 15px 0;">سکور: ${score}</div>
                <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
            </div>
        `;
        
        const optionsDiv = container.querySelector('#quizOptions');
        if (optionsDiv) {
            optionsDiv.innerHTML = options.map(opt => `<div class="quiz-option" data-opt="${opt}" style="background: var(--bg-primary, #f0f0f0); padding: 12px; border-radius: 10px; cursor: pointer;">${opt}</div>`).join('');
        }
        
        answered = false;
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.onclick = () => {
                if (answered) return;
                answered = true;
                const isCorrect = opt.dataset.opt === correctAnswer;
                if (isCorrect) {
                    opt.style.background = '#2ecc71';
                    opt.style.color = 'white';
                    score++;
                    document.getElementById('quizScore').innerHTML = `سکور: ${score}`;
                    showToast('صحیح جواب! 🎉');
                } else {
                    opt.style.background = '#e74c3c';
                    opt.style.color = 'white';
                    showToast('غلط جواب! دوبارہ کوشش کریں');
                }
                currentImageIndex = (currentImageIndex + 1) % images.length;
                setTimeout(() => loadQuestion(), 1500);
            };
        });
    };
    
    loadQuestion();
}

// ============================================
// SECTION 14: WAY 5 - SLIDESHOW
// ============================================
function renderSlideshow(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    let currentIndex = 0;
    let interval = null;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <img id="slideshowImg" src="${images[0]}" style="max-width: 400px; width: 100%; border-radius: 15px; margin-bottom: 15px; cursor: pointer;">
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px;">
                <button id="playPauseSlide" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">⏸️</button>
                <button id="prevSlide" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">◀ پچھلا</button>
                <button id="nextSlide" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">اگلا ▶</button>
            </div>
            <p id="slideCounter">تصویر 1 / ${images.length}</p>
            <button onclick="closeWayModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const img = document.getElementById('slideshowImg');
    const playPause = document.getElementById('playPauseSlide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const counter = document.getElementById('slideCounter');
    
    let isPlaying = true;
    
    const update = () => {
        img.src = images[currentIndex];
        counter.textContent = `تصویر ${currentIndex + 1} / ${images.length}`;
    };
    
    const start = () => { if (interval) clearInterval(interval); interval = setInterval(() => { currentIndex = (currentIndex + 1) % images.length; update(); }, 3000); };
    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    
    if (playPause) playPause.onclick = () => { if (isPlaying) { stop(); playPause.innerHTML = '▶️'; } else { start(); playPause.innerHTML = '⏸️'; } isPlaying = !isPlaying; };
    if (prevBtn) prevBtn.onclick = () => { currentIndex = (currentIndex - 1 + images.length) % images.length; update(); };
    if (nextBtn) nextBtn.onclick = () => { currentIndex = (currentIndex + 1) % images.length; update(); };
    if (img) img.onclick = () => openImageModal(images[currentIndex]);
    
    start();
}

// ============================================
// SECTION 15: WAY 6 - ODD ONE OUT
// ============================================
function renderOddOneOut(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const correctLetter = currentLetterObj ? currentLetterObj.name : '?';
    const otherLetters = alphabetList.filter(l => l.id !== currentLetter).slice(0, 3).map(l => l.name);
    const items = [{ name: correctLetter, isCorrect: true }, ...otherLetters.map(n => ({ name: n, isCorrect: false }))];
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <img src="${images[0]}" style="max-width: 200px; border-radius: 15px; margin-bottom: 20px;">
            <h4>ان میں سے کون سا مختلف ہے؟</h4>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0;">
                ${items.map(item => `<div class="odd-opt" data-correct="${item.isCorrect}" style="padding: 15px 25px; background: var(--primary-color, #3498db); color: white; border-radius: 10px; cursor: pointer;">${item.name}</div>`).join('')}
            </div>
            <div id="oddResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    document.querySelectorAll('.odd-opt').forEach(opt => {
        opt.onclick = () => {
            const result = document.getElementById('oddResult');
            if (opt.dataset.correct === 'true') {
                result.innerHTML = '<span style="color: green; font-size: 1.2rem;">✅ صحیح! یہ مختلف ہے</span>';
                showToast('صحیح جواب!');
            } else {
                result.innerHTML = '<span style="color: red; font-size: 1.2rem;">❌ غلط! دوبارہ کوشش کریں</span>';
                showToast('غلط جواب');
            }
        };
    });
}

// ============================================
// SECTION 16: WAY 7 - TRUE OR FALSE
// ============================================
function renderTrueFalse(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const statement = `یہ تصویر ${letterName} حرف کی ہے`;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <img src="${randomImg}" style="max-width: 250px; border-radius: 15px; margin-bottom: 20px;">
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${statement}</p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button id="trueBtn" style="padding: 10px 25px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">صحیح</button>
                <button id="falseBtn" style="padding: 10px 25px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">غلط</button>
            </div>
            <div id="tfResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    document.getElementById('trueBtn').onclick = () => {
        document.getElementById('tfResult').innerHTML = '<span style="color: green;">✅ صحیح جواب! (یہ تصویر اس حرف کی ہے)</span>';
        showToast('صحیح!');
    };
    document.getElementById('falseBtn').onclick = () => {
        document.getElementById('tfResult').innerHTML = '<span style="color: red;">❌ غلط! یہ تصویر اس حرف کی ہے</span>';
        showToast('غلط!');
    };
}

// ============================================
// SECTION 17: WAY 8 - DRAG & DROP
// ============================================
function renderDragDrop(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>تصویر کو صحیح حرف پر گھسیٹیں</h3>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin: 30px 0;">
                <div style="padding: 20px; background: var(--bg-primary, #f0f0f0); border-radius: 15px;">
                    <img id="dragImg" src="${randomImg}" draggable="true" style="width: 150px; height: 150px; object-fit: cover; border-radius: 10px; cursor: grab;">
                </div>
                <div id="dropZone" style="padding: 30px 40px; background: var(--card-bg, white); border: 3px dashed var(--primary-color, #3498db); border-radius: 15px;">
                    <span style="font-size: 2rem;">${letterName}</span>
                    <p>یہاں گھسیٹیں</p>
                </div>
            </div>
            <div id="dragResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const dragImg = document.getElementById('dragImg');
    const dropZone = document.getElementById('dropZone');
    const resultDiv = document.getElementById('dragResult');
    
    if (dragImg) dragImg.ondragstart = (e) => e.dataTransfer.setData('text/plain', 'image');
    if (dropZone) {
        dropZone.ondragover = (e) => e.preventDefault();
        dropZone.ondrop = (e) => {
            e.preventDefault();
            if (resultDiv) resultDiv.innerHTML = '<span style="color: green; font-size: 1.2rem;">✅ صحیح! آپ نے تصویر کو صحیح جگہ پر رکھا!</span>';
            showToast('صحیح!');
            showFloatingNotification('بہت خوب!');
        };
    }
}

// ============================================
// SECTION 18: WAY 9 - PICTURE HUNT
// ============================================
function renderPictureHunt(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>چھپی ہوئی تصویر ڈھونڈیں</h3>
            <div id="hiddenBox" style="width: 300px; height: 300px; background: repeating-linear-gradient(45deg, #ccc, #ccc 10px, #999 10px, #999 20px); margin: 20px auto; border-radius: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span style="background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 30px; color: white;">🔍 یہاں کلک کریں</span>
            </div>
            <div id="huntResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const hiddenBox = document.getElementById('hiddenBox');
    const resultDiv = document.getElementById('huntResult');
    
    if (hiddenBox) {
        hiddenBox.onclick = () => {
            hiddenBox.style.background = `url('${randomImg}') center/cover`;
            hiddenBox.innerHTML = '';
            if (resultDiv) resultDiv.innerHTML = '<span style="color: green;">🎉 واہ! آپ نے تصویر ڈھونڈ لی!</span>';
            showToast('آپ نے تصویر ڈھونڈ لی!');
            showFloatingNotification('بہت خوب!');
        };
    }
}

// ============================================
// SECTION 19: WAY 10 - DESCRIBE PICTURE
// ============================================
function renderDescribe(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <img src="${randomImg}" style="max-width: 300px; border-radius: 15px; margin-bottom: 20px;">
            <p>اس تصویر میں آپ کیا دیکھ رہے ہیں؟ اپنے الفاظ میں بتائیں</p>
            <textarea id="descText" rows="4" style="width: 100%; max-width: 400px; padding: 10px; border-radius: 10px; margin: 15px 0;" placeholder="اپنی کہانی یہاں لکھیں..."></textarea>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="submitDesc" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">سبمٹ کریں</button>
                <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
            </div>
        </div>
    `;
    
    const submitBtn = document.getElementById('submitDesc');
    if (submitBtn) {
        submitBtn.onclick = () => {
            const textarea = document.getElementById('descText');
            if (textarea && textarea.value.trim()) {
                showToast('آپ کی کہانی محفوظ ہوگئی!');
                showFloatingNotification('بہت خوب! آپ نے بہت اچھی کہانی لکھی');
                textarea.value = '';
            } else {
                showToast('براہ کرم کچھ لکھیں');
            }
        };
    }
}

// ============================================
// SECTION 20: API INTEGRATION (TiDB + Vercel + Grok)
// ============================================
const API_BASE = '/api/urdu-alphabet-stories';
const TOOL_SLUG = 'urdu-alphabet-stories';

function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_id', userId);
    }
    return userId;
}

function incrementUsage() {
    usageCount++;
    const counterEl = document.getElementById('usageCount');
    if (counterEl) counterEl.innerHTML = `<i class="fas fa-chart-line"></i> Used ${usageCount} times`;
    
    fetch(`${API_BASE}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: getUserId() })
    }).catch(e => console.log('API not available'));
}

function loadUsageCount() {
    fetch(`${API_BASE}/usage?tool_slug=${TOOL_SLUG}`)
        .then(res => res.json())
        .then(data => {
            if (data.count) {
                usageCount = data.count;
                const counterEl = document.getElementById('usageCount');
                if (counterEl) counterEl.innerHTML = `<i class="fas fa-chart-line"></i> Used ${usageCount} times`;
            }
        })
        .catch(e => console.log('API not available'));
}

function loadReactions() {
    fetch(`${API_BASE}/reactions?tool_slug=${TOOL_SLUG}`)
        .then(res => res.json())
        .then(data => {
            if (data.reactions) {
                document.getElementById('count-like').textContent = data.reactions.like || 0;
                document.getElementById('count-love').textContent = data.reactions.love || 0;
                document.getElementById('count-wow').textContent = data.reactions.wow || 0;
                document.getElementById('count-sad').textContent = data.reactions.sad || 0;
                document.getElementById('count-angry').textContent = data.reactions.angry || 0;
                document.getElementById('count-laugh').textContent = data.reactions.laugh || 0;
                document.getElementById('count-celebrate').textContent = data.reactions.celebrate || 0;
            }
        })
        .catch(e => console.log('API not available'));
}

function addReaction(emoji) {
    const map = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    fetch(`${API_BASE}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, user_id: getUserId() })
    })
        .then(res => res.json())
        .then(data => {
            if (data.counts) document.getElementById(`count-${map[emoji]}`).textContent = data.counts[map[emoji]] || 0;
            showToast(`آپ نے ${emoji} کا ردعمل دیا`);
        })
        .catch(e => {
            const current = parseInt(document.getElementById(`count-${map[emoji]}`).textContent);
            document.getElementById(`count-${map[emoji]}`).textContent = current + 1;
            showToast(`آپ نے ${emoji} کا ردعمل دیا`);
        });
}

function shareOnPlatform(platform) {
    const url = window.location.href;
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Magicrills اردو حروف کی کہانیاں سیکھیں!`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent('Magicrills اردو حروف کی کہانیاں - بچوں کے لیے بہترین ایپ! ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        email: `mailto:?subject=Magicrills اردو حروف کی کہانیاں&body=یہ بہت مفید ٹول ہے بچوں کے لیے! ${url}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(url);
        showToast('لنک کاپی ہوگیا!');
        showFloatingNotification('لنک کاپی ہوگیا!');
        return;
    }
    
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    showToast(`${platform} پر شیئر کیا`);
    
    fetch(`${API_BASE}/shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: getUserId() })
    }).catch(e => console.log('Share not tracked'));
}

// ============================================
// SECTION 21: HELPER FUNCTIONS
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}

function showFloatingNotification(message) {
    const notification = document.getElementById('floatingNotification');
    const textSpan = document.getElementById('notificationText');
    if (notification && textSpan) {
        textSpan.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 2500);
    }
}

function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.style.display = 'none';
}

function closeWayModal() {
    const modal = document.getElementById('wayModal');
    if (modal) modal.style.display = 'none';
}

function setupEventListeners() {
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        });
    }
    
    const scrollUp = document.getElementById('scrollUp');
    if (scrollUp) scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    const scrollDown = document.getElementById('scrollDown');
    if (scrollDown) scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    const modalClose = document.querySelector('#imageModal .close');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    const wayModalClose = document.querySelector('.way-modal-close');
    if (wayModalClose) wayModalClose.addEventListener('click', closeWayModal);
    
    window.onclick = (e) => {
        if (e.target === document.getElementById('imageModal')) closeModal();
        if (e.target === document.getElementById('wayModal')) closeWayModal();
    };
    
    document.querySelectorAll('.reaction').forEach(r => {
        r.addEventListener('click', () => {
            const emoji = r.querySelector('span:first-child')?.textContent;
            if (emoji) addReaction(emoji);
        });
    });
    
    document.querySelectorAll('.share-btn').forEach(b => {
        b.addEventListener('click', () => {
            const platform = b.dataset.platform;
            if (platform) shareOnPlatform(platform);
        });
    });
}

function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
}

// Make functions global for HTML access
window.openImageModal = openImageModal;
window.closeWayModal = closeWayModal;

console.log('✅ Magicrills Urdu Alphabet Stories - COMPLETE! 37 Stories + 10 Working Ways + API Ready!');
// ============================================
// SECTION 22: WAY 11 - COLORING
// ============================================
function renderColoring(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-palette"></i> رنگ بھریں</h3>
            <canvas id="coloringCanvas" width="300" height="300" style="border: 2px solid var(--border-color); border-radius: 15px; margin: 20px auto; background: white; cursor: crosshair;"></canvas>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0;">
                <label style="padding: 8px 15px; background: var(--bg-primary); border-radius: 10px;">🎨 رنگ: <input type="color" id="colorPicker" value="#3498db"></label>
                <button id="clearCanvas" style="padding: 8px 15px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">صاف کریں</button>
                <button id="downloadColoring" style="padding: 8px 15px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">ڈاؤن لوڈ کریں</button>
            </div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    // Load background image
    const bgImg = new Image();
    bgImg.crossOrigin = "Anonymous";
    bgImg.src = randomImg;
    bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    };
    
    // Drawing events
    canvas.onmousedown = () => { drawing = true; };
    canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
    canvas.onmousemove = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const color = document.getElementById('colorPicker').value;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    
    canvas.ontouchstart = (e) => { e.preventDefault(); drawing = true; };
    canvas.ontouchend = (e) => { e.preventDefault(); drawing = false; ctx.beginPath(); };
    canvas.ontouchmove = (e) => {
        e.preventDefault();
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        const color = document.getElementById('colorPicker').value;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    
    document.getElementById('clearCanvas').onclick = () => {
        const img = new Image();
        img.src = randomImg;
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        showToast('کینوس صاف ہوگیا');
    };
    
    document.getElementById('downloadColoring').onclick = () => {
        const link = document.createElement('a');
        link.download = 'coloring.png';
        link.href = canvas.toDataURL();
        link.click();
        showToast('تصویر ڈاؤن لوڈ ہوگئی');
    };
}

// ============================================
// SECTION 23: WAY 12 - ZOOM & EXPLORE
// ============================================
function renderZoom(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    let currentIndex = 0;
    let zoomLevel = 1;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-search-plus"></i> زوم کریں اور دیکھیں</h3>
            <div style="position: relative; margin: 20px auto; overflow: hidden; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">
                <img id="zoomImg" src="${images[0]}" style="width: 100%; max-width: 400px; height: auto; transition: transform 0.3s; cursor: zoom-in;">
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
                <button id="zoomIn" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;"><i class="fas fa-search-plus"></i> زوم ان</button>
                <button id="zoomOut" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;"><i class="fas fa-search-minus"></i> زوم آؤٹ</button>
                <button id="resetZoom" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">ری سیٹ</button>
                <button id="prevZoomImg" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">◀ پچھلی</button>
                <button id="nextZoomImg" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">اگلی ▶</button>
            </div>
            <p id="zoomCounter">تصویر 1 / ${images.length}</p>
            <button onclick="closeWayModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const img = document.getElementById('zoomImg');
    const counter = document.getElementById('zoomCounter');
    
    const updateImage = () => {
        img.src = images[currentIndex];
        zoomLevel = 1;
        img.style.transform = `scale(${zoomLevel})`;
        counter.textContent = `تصویر ${currentIndex + 1} / ${images.length}`;
    };
    
    document.getElementById('zoomIn').onclick = () => {
        zoomLevel = Math.min(zoomLevel + 0.25, 3);
        img.style.transform = `scale(${zoomLevel})`;
        img.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
    };
    
    document.getElementById('zoomOut').onclick = () => {
        zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
        img.style.transform = `scale(${zoomLevel})`;
        img.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
    };
    
    document.getElementById('resetZoom').onclick = () => {
        zoomLevel = 1;
        img.style.transform = `scale(${zoomLevel})`;
        img.style.cursor = 'zoom-in';
    };
    
    document.getElementById('prevZoomImg').onclick = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    };
    
    document.getElementById('nextZoomImg').onclick = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    };
    
    img.onclick = () => {
        if (zoomLevel === 1) {
            zoomLevel = 2;
            img.style.transform = `scale(${zoomLevel})`;
            img.style.cursor = 'zoom-out';
        } else {
            zoomLevel = 1;
            img.style.transform = `scale(${zoomLevel})`;
            img.style.cursor = 'zoom-in';
        }
    };
    
    updateImage();
}

// ============================================
// SECTION 24: WAY 13 - LABEL IT
// ============================================
function renderLabel(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-tag"></i> نام لکھیں</h3>
            <img src="${randomImg}" style="max-width: 300px; border-radius: 15px; margin: 20px auto; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">
            <p style="margin: 15px 0;">اس تصویر کا نام کیا ہے؟</p>
            <input type="text" id="labelInput" placeholder="نام لکھیں..." style="padding: 10px; width: 80%; max-width: 250px; border-radius: 10px; border: 1px solid var(--border-color); margin: 10px 0;">
            <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                <button id="checkLabel" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">چیک کریں</button>
                <button id="showAnswer" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">جواب دیکھیں</button>
            </div>
            <div id="labelResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const input = document.getElementById('labelInput');
    const resultDiv = document.getElementById('labelResult');
    
    document.getElementById('checkLabel').onclick = () => {
        const userAnswer = input.value.trim();
        if (userAnswer === letterName) {
            resultDiv.innerHTML = '<span style="color: green; font-size: 1.1rem;">✅ صحیح! بہت خوب!</span>';
            showToast('صحیح جواب!');
            showFloatingNotification('واہ! آپ نے صحیح جواب دیا!');
        } else if (userAnswer === '') {
            resultDiv.innerHTML = '<span style="color: orange;">⚠️ براہ کرم کوئی نام لکھیں</span>';
        } else {
            resultDiv.innerHTML = `<span style="color: red;">❌ غلط! صحیح جواب ہے: ${letterName}</span>`;
            showToast('غلط جواب! دوبارہ کوشش کریں');
        }
    };
    
    document.getElementById('showAnswer').onclick = () => {
        resultDiv.innerHTML = `<span style="color: blue;">📖 صحیح جواب: ${letterName}</span>`;
    };
}

// ============================================
// SECTION 25: WAY 14 - STORY BUILDER
// ============================================
function renderStoryBuilder(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-book-open"></i> اپنی کہانی بنائیں</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
                ${images.slice(0, 4).map(img => `
                    <div style="text-align: center; cursor: pointer;" onclick="addToStory('${img}')">
                        <img src="${img}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;">
                        <p style="font-size: 0.8rem; margin-top: 5px;">منتخب کریں</p>
                    </div>
                `).join('')}
            </div>
            <div style="margin: 20px 0;">
                <h4>آپ کی کہانی</h4>
                <div id="storyBuilderList" style="min-height: 100px; background: var(--bg-primary); border-radius: 15px; padding: 15px; margin: 10px 0;"></div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="clearStory" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">صاف کریں</button>
                    <button id="saveStory" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">کہانی محفوظ کریں</button>
                </div>
            </div>
            <textarea id="storyTextArea" rows="3" style="width: 100%; max-width: 400px; padding: 10px; border-radius: 10px; margin: 15px 0;" placeholder="اپنی کہانی یہاں لکھیں..."></textarea>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const storyList = document.getElementById('storyBuilderList');
    const textarea = document.getElementById('storyTextArea');
    let selectedImages = [];
    
    window.addToStory = (imgSrc) => {
        selectedImages.push(imgSrc);
        storyList.innerHTML = selectedImages.map((img, i) => `
            <div style="display: inline-block; margin: 5px; position: relative;">
                <img src="${img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <span onclick="removeFromStory(${i})" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;">×</span>
            </div>
        `).join('');
        showToast('تصویر کہانی میں شامل ہوگئی');
    };
    
    window.removeFromStory = (index) => {
        selectedImages.splice(index, 1);
        storyList.innerHTML = selectedImages.map((img, i) => `
            <div style="display: inline-block; margin: 5px; position: relative;">
                <img src="${img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <span onclick="removeFromStory(${i})" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;">×</span>
            </div>
        `).join('');
        showToast('تصویر ہٹا دی گئی');
    };
    
    document.getElementById('clearStory').onclick = () => {
        selectedImages = [];
        storyList.innerHTML = '';
        textarea.value = '';
        showToast('کہانی صاف ہوگئی');
    };
    
    document.getElementById('saveStory').onclick = () => {
        if (textarea.value.trim() || selectedImages.length > 0) {
            localStorage.setItem('savedStory', JSON.stringify({ text: textarea.value, images: selectedImages }));
            showToast('کہانی محفوظ ہوگئی!');
            showFloatingNotification('آپ کی کہانی محفوظ ہوگئی!');
        } else {
            showToast('براہ کرم کچھ لکھیں یا تصاویر منتخب کریں');
        }
    };
}

// ============================================
// SECTION 26: WAY 15 - VOICE RECOGNITION
// ============================================
function renderVoice(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-microphone"></i> آواز سے سیکھیں</h3>
            <img src="${randomImg}" style="max-width: 250px; border-radius: 15px; margin: 20px auto;">
            <p style="margin: 15px 0;">اس تصویر کا نام بولیں</p>
            <button id="startVoice" style="padding: 15px 30px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 1.2rem;">
                <i class="fas fa-microphone"></i> بولیں
            </button>
            <div id="voiceResult" style="margin: 20px 0; padding: 15px; background: var(--bg-primary); border-radius: 10px;"></div>
            <button onclick="closeWayModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const resultDiv = document.getElementById('voiceResult');
    
    document.getElementById('startVoice').onclick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            resultDiv.innerHTML = '<span style="color: red;">❌ آپ کا براؤزر وائس ریکگنیشن سپورٹ نہیں کرتا۔ Chrome استعمال کریں۔</span>';
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ur-PK';
        recognition.continuous = false;
        
        recognition.onstart = () => {
            resultDiv.innerHTML = '<span style="color: blue;">🎤 سن رہا ہوں... بولیں</span>';
        };
        
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            resultDiv.innerHTML = `<span>آپ نے کہا: "${spokenText}"</span>`;
            
            if (spokenText.includes(letterName) || letterName.includes(spokenText)) {
                resultDiv.innerHTML += '<br><span style="color: green;">✅ صحیح! بہت خوب!</span>';
                showToast('صحیح! بہت خوب!');
                showFloatingNotification('واہ! آپ نے صحیح بولا!');
            } else {
                resultDiv.innerHTML += `<br><span style="color: red;">❌ غلط! صحیح جواب ہے: ${letterName}</span>`;
                showToast('غلط! دوبارہ کوشش کریں');
            }
        };
        
        recognition.onerror = () => {
            resultDiv.innerHTML = '<span style="color: red;">❌ کوئی آواز نہیں سنی۔ دوبارہ کوشش کریں۔</span>';
        };
        
        recognition.start();
    };
}

// ============================================
// SECTION 27: WAY 16 - SPEED CHALLENGE
// ============================================
function renderSpeed(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    let score = 0;
    let timeLeft = 30;
    let timer = null;
    let currentImageIndex = 0;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-stopwatch"></i> سپیڈ چیلنج</h3>
            <div style="display: flex; justify-content: center; gap: 30px; margin: 20px 0;">
                <div style="background: var(--bg-primary); padding: 15px; border-radius: 15px;">
                    <h4>سکور</h4>
                    <p id="speedScore" style="font-size: 2rem; font-weight: bold;">0</p>
                </div>
                <div style="background: var(--bg-primary); padding: 15px; border-radius: 15px;">
                    <h4>وقت باقی</h4>
                    <p id="speedTimer" style="font-size: 2rem; font-weight: bold;">30</p>
                </div>
            </div>
            <img id="speedImg" src="${images[0]}" style="max-width: 200px; border-radius: 15px; margin: 20px auto;">
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <button id="speedTrue" style="padding: 15px 30px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">صحیح</button>
                <button id="speedFalse" style="padding: 15px 30px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">غلط</button>
            </div>
            <button id="startSpeed" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">شروع کریں</button>
            <div id="speedResult" style="margin: 20px 0;"></div>
            <button onclick="closeWayModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const scoreEl = document.getElementById('speedScore');
    const timerEl = document.getElementById('speedTimer');
    const img = document.getElementById('speedImg');
    const resultDiv = document.getElementById('speedResult');
    const startBtn = document.getElementById('startSpeed');
    const trueBtn = document.getElementById('speedTrue');
    const falseBtn = document.getElementById('speedFalse');
    
    const loadNewImage = () => {
        currentImageIndex = Math.floor(Math.random() * images.length);
        img.src = images[currentImageIndex];
    };
    
    const updateUI = () => {
        scoreEl.textContent = score;
        timerEl.textContent = timeLeft;
    };
    
    const endGame = () => {
        if (timer) clearInterval(timer);
        resultDiv.innerHTML = `<span style="color: gold; font-size: 1.2rem;">🎉 گیم ختم! آپ کا سکور: ${score} 🎉</span>`;
        showFloatingNotification(`چیلنج ختم! آپ نے ${score} صحیح جواب دیے!`);
        trueBtn.disabled = true;
        falseBtn.disabled = true;
    };
    
    const startTimer = () => {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    };
    
    startBtn.onclick = () => {
        score = 0;
        timeLeft = 30;
        updateUI();
        loadNewImage();
        startTimer();
        resultDiv.innerHTML = '';
        trueBtn.disabled = false;
        falseBtn.disabled = false;
        startBtn.disabled = true;
        showToast('چیلنج شروع! جلدی جواب دیں!');
    };
    
    trueBtn.onclick = () => {
        if (timeLeft <= 0) return;
        score++;
        scoreEl.textContent = score;
        loadNewImage();
        showToast('صحیح! +1');
    };
    
    falseBtn.onclick = () => {
        if (timeLeft <= 0) return;
        loadNewImage();
        showToast('اگلی تصویر');
    };
}

// ============================================
// SECTION 28: WAY 17 - SPIN WHEEL
// ============================================
function renderSpin(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    let spinning = false;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-chart-simple"></i> وہیل گھمائیں</h3>
            <canvas id="wheelCanvas" width="300" height="300" style="margin: 20px auto; border-radius: 50%; box-shadow: 0 5px 20px rgba(0,0,0,0.2);"></canvas>
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <button id="spinWheel" style="padding: 12px 25px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 گھمائیں</button>
                <button id="resetWheel" style="padding: 12px 25px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">ری سیٹ</button>
            </div>
            <div id="wheelResult" style="margin: 20px 0; padding: 15px; background: var(--bg-primary); border-radius: 10px;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('wheelResult');
    let currentAngle = 0;
    let segments = images.slice(0, 8);
    
    const drawWheel = () => {
        const angleStep = (Math.PI * 2) / segments.length;
        for (let i = 0; i < segments.length; i++) {
            const angle = currentAngle + i * angleStep;
            ctx.beginPath();
            ctx.arc(150, 150, 140, angle, angle + angleStep);
            ctx.lineTo(150, 150);
            ctx.fillStyle = `hsl(${i * 45}, 70%, 60%)`;
            ctx.fill();
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(angle + angleStep / 2);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`${i + 1}`, 100, 10);
            ctx.restore();
        }
    };
    
    const spin = () => {
        if (spinning) return;
        spinning = true;
        const spinAngle = Math.random() * 360 + 720;
        const startTime = performance.now();
        const duration = 2000;
        
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const angle = (spinAngle * easeOut) % 360;
            currentAngle = (angle * Math.PI) / 180;
            drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                const winnerIndex = Math.floor(((360 - (angle % 360)) / 360) * segments.length) % segments.length;
                resultDiv.innerHTML = `<span style="color: green; font-size: 1.1rem;">🎉 آپ کو تصویر نمبر ${winnerIndex + 1} ملی! 🎉</span>`;
                showToast(`تصویر ${winnerIndex + 1}`);
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    document.getElementById('spinWheel').onclick = spin;
    document.getElementById('resetWheel').onclick = () => {
        currentAngle = 0;
        drawWheel();
        resultDiv.innerHTML = '';
        showToast('وہیل ری سیٹ ہوگئی');
    };
    
    drawWheel();
}

// ============================================
// SECTION 29: WAY 18 - BINGO GAME
// ============================================
function renderBingo(container, images) {
    if (!images || images.length < 4) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 4 تصاویر درکار ہیں</div>';
        return;
    }
    
    const bingoImages = images.slice(0, 9);
    const calledNumbers = [];
    let bingoCalled = false;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-border-all"></i> بنگو گیم</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 400px; margin: 20px auto;">
                ${bingoImages.map((img, i) => `
                    <div class="bingo-cell" data-index="${i}" style="background: var(--bg-primary); padding: 10px; border-radius: 10px; cursor: pointer; text-align: center;">
                        <img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                        <span style="display: block; margin-top: 5px;">${i + 1}</span>
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <button id="callNumber" style="padding: 12px 25px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">🎲 نمبر بلائیں</button>
                <button id="resetBingo" style="padding: 12px 25px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">ری سیٹ</button>
            </div>
            <div id="bingoStatus" style="margin: 20px 0; padding: 15px; background: var(--bg-primary); border-radius: 10px;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const statusDiv = document.getElementById('bingoStatus');
    
    const checkBingo = () => {
        if (bingoCalled) return;
        const marked = Array.from(document.querySelectorAll('.bingo-cell.marked')).map(cell => parseInt(cell.dataset.index));
        if (marked.length >= 5) {
            bingoCalled = true;
            statusDiv.innerHTML = '<span style="color: gold; font-size: 1.2rem;">🎉 بنگو! آپ جیت گئے! 🎉</span>';
            showFloatingNotification('بنگو! مبارک ہو!');
        }
    };
    
    document.getElementById('callNumber').onclick = () => {
        if (bingoCalled) return;
        let num;
        do {
            num = Math.floor(Math.random() * bingoImages.length);
        } while (calledNumbers.includes(num));
        calledNumbers.push(num);
        
        const cell = document.querySelector(`.bingo-cell[data-index="${num}"]`);
        if (cell) {
            cell.classList.add('marked');
            cell.style.background = '#2ecc71';
            statusDiv.innerHTML = `<span style="color: green;">✅ نمبر ${num + 1} بلایا گیا!</span>`;
            showToast(`نمبر ${num + 1}`);
            checkBingo();
        }
    };
    
    document.getElementById('resetBingo').onclick = () => {
        calledNumbers.length = 0;
        bingoCalled = false;
        document.querySelectorAll('.bingo-cell').forEach(cell => {
            cell.classList.remove('marked');
            cell.style.background = 'var(--bg-primary)';
        });
        statusDiv.innerHTML = '<span style="color: blue;">🔄 گیم ری سیٹ ہوگئی! شروع کریں</span>';
        showToast('بنگو ری سیٹ ہوگیا');
    };
}

// ============================================
// SECTION 30: WAY 19 - JIGSAW PUZZLE
// ============================================
function renderPuzzle(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const puzzleImg = images[0];
    const pieces = [];
    const pieceSize = 100;
    const gridSize = 3;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        pieces.push(i);
    }
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-puzzle-piece"></i> جگسا پزل</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; max-width: 350px; margin: 20px auto;" id="puzzleGrid"></div>
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <button id="shufflePuzzle" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 شفل</button>
                <button id="checkPuzzle" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">✅ چیک کریں</button>
            </div>
            <div id="puzzleResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const grid = document.getElementById('puzzleGrid');
    const resultDiv = document.getElementById('puzzleResult');
    
    const renderGrid = () => {
        grid.innerHTML = '';
        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            const x = (piece % gridSize) * pieceSize;
            const y = Math.floor(piece / gridSize) * pieceSize;
            const div = document.createElement('div');
            div.style.width = `${pieceSize}px`;
            div.style.height = `${pieceSize}px`;
            div.style.backgroundImage = `url('${puzzleImg}')`;
            div.style.backgroundSize = `${gridSize * pieceSize}px ${gridSize * pieceSize}px`;
            div.style.backgroundPosition = `-${x}px -${y}px`;
            div.style.border = '1px solid #ccc';
            div.style.cursor = 'pointer';
            div.style.borderRadius = '5px';
            div.dataset.index = i;
            div.onclick = () => {
                if (i < pieces.length - 1) {
                    [pieces[i], pieces[i + 1]] = [pieces[i + 1], pieces[i]];
                    renderGrid();
                }
            };
            grid.appendChild(div);
        }
    };
    
    document.getElementById('shufflePuzzle').onclick = () => {
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }
        renderGrid();
        resultDiv.innerHTML = '';
        showToast('پزل شفل ہوگیا');
    };
    
    document.getElementById('checkPuzzle').onclick = () => {
        let solved = true;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i] !== i) {
                solved = false;
                break;
            }
        }
        if (solved) {
            resultDiv.innerHTML = '<span style="color: gold; font-size: 1.2rem;">🎉 مبارک ہو! آپ نے پزل حل کر لیا! 🎉</span>';
            showFloatingNotification('واہ! آپ نے پزل حل کر لیا!');
        } else {
            resultDiv.innerHTML = '<span style="color: red;">❌ پزل حل نہیں ہوا! دوبارہ کوشش کریں</span>';
            showToast('پزل حل نہیں ہوا، دوبارہ کوشش کریں');
        }
    };
    
    renderGrid();
}

// ============================================
// SECTION 31: WAY 20 - HIDDEN PICTURE
// ============================================
function renderHidden(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const hiddenImg = images[0];
    let revealedCount = 0;
    const gridSize = 4;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-eye-slash"></i> چھپی ہوئی تصویر</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 400px; margin: 20px auto;" id="hiddenGrid"></div>
            <div id="hiddenResult" style="margin: 15px 0;"></div>
            <button id="resetHidden" style="margin: 10px; padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">دوبارہ شروع کریں</button>
            <button onclick="closeWayModal()" style="margin: 10px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const grid = document.getElementById('hiddenGrid');
    const resultDiv = document.getElementById('hiddenResult');
    let revealed = new Array(gridSize * gridSize).fill(false);
    
    const renderHiddenGrid = () => {
        grid.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const div = document.createElement('div');
            div.style.aspectRatio = '1';
            div.style.background = revealed[i] ? `url('${hiddenImg}') center/cover` : 'var(--primary-color)';
            div.style.borderRadius = '10px';
            div.style.cursor = 'pointer';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.color = 'white';
            div.style.fontSize = '1.5rem';
            div.innerHTML = revealed[i] ? '' : '?';
            div.onclick = () => {
                if (!revealed[i]) {
                    revealed[i] = true;
                    revealedCount++;
                    renderHiddenGrid();
                    showToast(`ٹائل ${i + 1} کھل گیا!`);
                    if (revealedCount === gridSize * gridSize) {
                        resultDiv.innerHTML = '<span style="color: gold; font-size: 1.2rem;">🎉 مبارک ہو! آپ نے پوری تصویر کھول دی! 🎉</span>';
                        showFloatingNotification('واہ! آپ نے پوری تصویر کھول دی!');
                    }
                }
            };
            grid.appendChild(div);
        }
    };
    
    document.getElementById('resetHidden').onclick = () => {
        revealed = new Array(gridSize * gridSize).fill(false);
        revealedCount = 0;
        resultDiv.innerHTML = '';
        renderHiddenGrid();
        showToast('گیم دوبارہ شروع ہوگئی');
    };
    
    renderHiddenGrid();
}

// ============================================
// UPDATE SWITCH CASE FOR WAYS 11-20
// ============================================
// Add these cases to your existing openLearningWay function's switch statement:

/*
case 'coloring':
    renderColoring(bodyEl, data.images);
    break;
case 'zoom':
    renderZoom(bodyEl, data.images);
    break;
case 'label':
    renderLabel(bodyEl, data.images);
    break;
case 'storyBuilder':
    renderStoryBuilder(bodyEl, data.images);
    break;
case 'voice':
    renderVoice(bodyEl, data.images);
    break;
case 'speed':
    renderSpeed(bodyEl, data.images);
    break;
case 'spin':
    renderSpin(bodyEl, data.images);
    break;
case 'bingo':
    renderBingo(bodyEl, data.images);
    break;
case 'puzzle':
    renderPuzzle(bodyEl, data.images);
    break;
case 'hidden':
    renderHidden(bodyEl, data.images);
    break;
*/
// ============================================
// SECTION 32: WAY 21 - STORY DICE
// ============================================
function renderStoryDice(container, images) {
    if (!images || images.length < 3) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 3 تصاویر درکار ہیں</div>';
        return;
    }
    
    let diceImages = images.slice(0, 6);
    let currentDice = [0, 0, 0];
    let storyText = '';
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-dice"></i> اسٹوری ڈائس</h3>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 30px 0;">
                ${currentDice.map((val, idx) => `
                    <div class="dice" data-idx="${idx}" style="width: 100px; height: 100px; background: var(--bg-primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                        <img src="${diceImages[0]}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
                <button id="rollAllDice" style="padding: 12px 25px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">🎲 سب گھمائیں</button>
                <button id="generateStory" style="padding: 12px 25px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">📖 کہانی بنائیں</button>
            </div>
            <div id="diceStory" style="margin: 20px 0; padding: 20px; background: var(--bg-primary); border-radius: 15px; min-height: 100px;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const updateDice = () => {
        document.querySelectorAll('.dice').forEach((dice, idx) => {
            const img = dice.querySelector('img');
            if (img) img.src = diceImages[currentDice[idx]];
        });
    };
    
    const rollDice = (idx) => {
        currentDice[idx] = Math.floor(Math.random() * diceImages.length);
        updateDice();
        showToast(`ڈائس ${idx + 1} گھوم گیا`);
    };
    
    document.querySelectorAll('.dice').forEach(dice => {
        dice.onclick = () => rollDice(parseInt(dice.dataset.idx));
    });
    
    document.getElementById('rollAllDice').onclick = () => {
        for (let i = 0; i < currentDice.length; i++) {
            currentDice[i] = Math.floor(Math.random() * diceImages.length);
        }
        updateDice();
        showToast('سب ڈائس گھوم گئے!');
    };
    
    document.getElementById('generateStory').onclick = () => {
        const storyParts = [
            `ایک دن ${diceImages[currentDice[0]]?.split('=')[1]?.split('&')[0] || 'ایک'} تصویر والی جگہ پر،`,
            `وہاں ${diceImages[currentDice[1]]?.split('=')[1]?.split('&')[0] || 'دوسری'} چیز نظر آئی۔`,
            `آخر میں ${diceImages[currentDice[2]]?.split('=')[1]?.split('&')[0] || 'تیسری'} چیز نے سب کو خوش کر دیا۔`
        ];
        storyText = storyParts.join(' ');
        document.getElementById('diceStory').innerHTML = `<p style="font-size: 1.1rem;">📖 ${storyText}</p>`;
        showToast('کہانی تیار ہے!');
    };
    
    updateDice();
}

// ============================================
// SECTION 33: WAY 22 - SORT IT (CATEGORY SORTING)
// ============================================
function renderSort(container, images) {
    if (!images || images.length < 4) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 4 تصاویر درکار ہیں</div>';
        return;
    }
    
    const sortImages = images.slice(0, 6);
    let sortOrder = [...sortImages];
    for (let i = sortOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortOrder[i], sortOrder[j]] = [sortOrder[j], sortOrder[i]];
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-table-list"></i> ترتیب دیں</h3>
            <p style="margin: 10px 0;">تصاویر کو صحیح ترتیب میں لگائیں</p>
            <div id="sortList" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 20px auto;"></div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
                <button id="checkSort" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">✅ چیک کریں</button>
                <button id="resetSort" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 شفل</button>
            </div>
            <div id="sortResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const sortList = document.getElementById('sortList');
    const resultDiv = document.getElementById('sortResult');
    
    const renderSortList = () => {
        sortList.innerHTML = sortOrder.map((img, i) => `
            <div draggable="true" data-index="${i}" style="display: flex; align-items: center; gap: 15px; background: var(--bg-primary); padding: 10px; border-radius: 10px; cursor: grab;">
                <span style="font-size: 1.2rem;">☰</span>
                <img src="${img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <span>تصویر ${i + 1}</span>
            </div>
        `).join('');
        
        const items = document.querySelectorAll('#sortList > div');
        items.forEach(item => {
            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.index);
                item.style.opacity = '0.5';
            };
            item.ondragend = (e) => { item.style.opacity = '1'; };
            item.ondragover = (e) => { e.preventDefault(); };
            item.ondrop = (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = parseInt(item.dataset.index);
                if (fromIndex !== toIndex) {
                    const temp = sortOrder[fromIndex];
                    sortOrder[fromIndex] = sortOrder[toIndex];
                    sortOrder[toIndex] = temp;
                    renderSortList();
                }
            };
        });
    };
    
    document.getElementById('checkSort').onclick = () => {
        let correct = true;
        for (let i = 0; i < sortOrder.length; i++) {
            if (sortOrder[i] !== sortImages[i]) {
                correct = false;
                break;
            }
        }
        if (correct) {
            resultDiv.innerHTML = '<span style="color: green; font-size: 1.1rem;">✅ صحیح! آپ نے درست ترتیب لگا دی!</span>';
            showToast('صحیح ترتیب!');
            showFloatingNotification('واہ! بہت خوب!');
        } else {
            resultDiv.innerHTML = '<span style="color: red;">❌ غلط ترتیب! دوبارہ کوشش کریں</span>';
            showToast('غلط ترتیب، دوبارہ کوشش کریں');
        }
    };
    
    document.getElementById('resetSort').onclick = () => {
        for (let i = sortOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sortOrder[i], sortOrder[j]] = [sortOrder[j], sortOrder[i]];
        }
        renderSortList();
        resultDiv.innerHTML = '';
        showToast('ترتیب شفل ہوگئی');
    };
    
    renderSortList();
}

// ============================================
// SECTION 34: WAY 23 - COMIC MAKER
// ============================================
function renderComic(container, images) {
    if (!images || images.length < 3) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 3 تصاویر درکار ہیں</div>';
        return;
    }
    
    const comicImages = images.slice(0, 4);
    let comicPanels = [...comicImages];
    let comicTexts = ['', '', '', ''];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-stamp"></i> کامک سٹریپ بنائیں</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 500px; margin: 20px auto;">
                ${comicPanels.map((img, i) => `
                    <div style="background: var(--bg-primary); border-radius: 15px; padding: 10px;">
                        <img src="${img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px;">
                        <textarea class="comicText" data-idx="${i}" rows="2" placeholder="یہاں ڈائیلاگ لکھیں..." style="width: 100%; margin-top: 8px; padding: 5px; border-radius: 8px;"></textarea>
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
                <button id="saveComic" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">💾 کامک محفوظ کریں</button>
                <button id="resetComic" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 ری سیٹ</button>
            </div>
            <div id="comicResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    document.querySelectorAll('.comicText').forEach(textarea => {
        textarea.oninput = (e) => {
            comicTexts[parseInt(e.target.dataset.idx)] = e.target.value;
        };
    });
    
    document.getElementById('saveComic').onclick = () => {
        const comicData = { images: comicPanels, texts: comicTexts, timestamp: Date.now() };
        localStorage.setItem('savedComic', JSON.stringify(comicData));
        document.getElementById('comicResult').innerHTML = '<span style="color: green;">✅ کامک محفوظ ہوگیا!</span>';
        showToast('آپ کی کامک محفوظ ہوگئی!');
        showFloatingNotification('واہ! آپ نے کامک بنا لی!');
    };
    
    document.getElementById('resetComic').onclick = () => {
        document.querySelectorAll('.comicText').forEach(textarea => { textarea.value = ''; });
        comicTexts = ['', '', '', ''];
        document.getElementById('comicResult').innerHTML = '';
        showToast('کامک ری سیٹ ہوگیا');
    };
}

// ============================================
// SECTION 35: WAY 24 - COMPLETE SCENE
// ============================================
function renderCompleteScene(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const sceneImg = images[0];
    const missingParts = [
        { x: 50, y: 50, w: 80, h: 80, name: "بادل", placed: false },
        { x: 200, y: 150, w: 60, h: 60, name: "پرندہ", placed: false },
        { x: 150, y: 200, w: 70, h: 70, name: "پھول", placed: false }
    ];
    let completedCount = 0;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-image"></i> منظر مکمل کریں</h3>
            <div style="position: relative; display: inline-block; margin: 20px auto;">
                <img id="sceneImg" src="${sceneImg}" style="max-width: 400px; width: 100%; border-radius: 15px;">
                <canvas id="sceneCanvas" width="400" height="300" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: crosshair;"></canvas>
            </div>
            <div id="missingPartsList" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0;">
                ${missingParts.map((part, i) => `
                    <div class="missing-part" data-idx="${i}" style="background: var(--bg-primary); padding: 10px 20px; border-radius: 30px; cursor: pointer; ${part.placed ? 'opacity: 0.5; text-decoration: line-through;' : ''}">
                        🧩 ${part.name}
                    </div>
                `).join('')}
            </div>
            <div id="sceneResult" style="margin: 15px 0;"></div>
            <button id="resetScene" style="margin: 10px; padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">دوبارہ شروع کریں</button>
            <button onclick="closeWayModal()" style="margin: 10px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const canvas = document.getElementById('sceneCanvas');
    const ctx = canvas.getContext('2d');
    let selectedPart = null;
    
    const updateMissingList = () => {
        document.querySelectorAll('.missing-part').forEach((el, i) => {
            if (missingParts[i].placed) {
                el.style.opacity = '0.5';
                el.style.textDecoration = 'line-through';
            } else {
                el.style.opacity = '1';
                el.style.textDecoration = 'none';
            }
        });
    };
    
    document.querySelectorAll('.missing-part').forEach(el => {
        el.onclick = () => {
            const idx = parseInt(el.dataset.idx);
            if (!missingParts[idx].placed) {
                selectedPart = idx;
                showToast(`${missingParts[idx].name} منتخب - تصویر پر کلک کریں`);
            }
        };
    });
    
    canvas.onclick = (e) => {
        if (selectedPart !== null && !missingParts[selectedPart].placed) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            const part = missingParts[selectedPart];
            if (x >= part.x && x <= part.x + part.w && y >= part.y && y <= part.y + part.h) {
                part.placed = true;
                completedCount++;
                ctx.fillStyle = 'rgba(0,255,0,0.3)';
                ctx.fillRect(part.x, part.y, part.w, part.h);
                updateMissingList();
                showToast(`✅ ${part.name} صحیح جگہ پر رکھا!`);
                
                if (completedCount === missingParts.length) {
                    document.getElementById('sceneResult').innerHTML = '<span style="color: gold; font-size: 1.2rem;">🎉 مبارک ہو! آپ نے منظر مکمل کر لیا! 🎉</span>';
                    showFloatingNotification('واہ! منظر مکمل ہوگیا!');
                }
            } else {
                showToast(`❌ غلط جگہ! ${part.name} کو صحیح جگہ پر رکھیں`);
            }
            selectedPart = null;
        }
    };
    
    document.getElementById('resetScene').onclick = () => {
        missingParts.forEach(part => part.placed = false);
        completedCount = 0;
        selectedPart = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateMissingList();
        document.getElementById('sceneResult').innerHTML = '';
        showToast('منظر ری سیٹ ہوگیا');
    };
    
    // Draw hint outlines
    missingParts.forEach(part => {
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(part.x, part.y, part.w, part.h);
    });
    ctx.setLineDash([]);
}

// ============================================
// SECTION 36: WAY 25 - WHAT'S NEXT
// ============================================
function renderWhatsNext(container, images) {
    if (!images || images.length < 3) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 3 تصاویر درکار ہیں</div>';
        return;
    }
    
    let sequence = images.slice(0, 3);
    let currentIndex = 0;
    let score = 0;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-forward"></i> اگلی تصویر کیا ہے؟</h3>
            <div style="display: flex; justify-content: center; gap: 10px; margin: 20px 0;">
                <img src="${sequence[0]}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;">
                <span style="font-size: 2rem;">→</span>
                <img src="${sequence[1]}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;">
                <span style="font-size: 2rem;">→</span>
                <div id="nextPlaceholder" style="width: 100px; height: 100px; background: var(--bg-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px dashed var(--primary-color);">?</div>
            </div>
            <div id="whatsNextOptions" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 20px 0;"></div>
            <div id="whatsNextScore" style="margin: 15px 0;">سکور: ${score}</div>
            <button id="resetWhatsNext" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">دوبارہ شروع کریں</button>
            <button onclick="closeWayModal()" style="margin: 10px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const loadQuestion = () => {
        const correctAnswer = sequence[currentIndex % sequence.length];
        const wrongAnswers = images.filter(img => img !== correctAnswer).slice(0, 3);
        const options = [correctAnswer, ...wrongAnswers];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        const optionsDiv = document.getElementById('whatsNextOptions');
        optionsDiv.innerHTML = options.map(opt => `
            <div class="whatsnext-opt" data-img="${opt}" style="background: var(--bg-primary); padding: 10px; border-radius: 10px; cursor: pointer;">
                <img src="${opt}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
        `).join('');
        
        document.querySelectorAll('.whatsnext-opt').forEach(opt => {
            opt.onclick = () => {
                if (opt.dataset.img === correctAnswer) {
                    score++;
                    document.getElementById('whatsNextScore').innerHTML = `سکور: ${score}`;
                    showToast('صحیح! +1');
                    currentIndex++;
                    loadQuestion();
                } else {
                    showToast('غلط! دوبارہ کوشش کریں');
                    opt.style.background = '#e74c3c';
                    setTimeout(() => { opt.style.background = 'var(--bg-primary)'; }, 500);
                }
            };
        });
    };
    
    document.getElementById('resetWhatsNext').onclick = () => {
        score = 0;
        currentIndex = 0;
        document.getElementById('whatsNextScore').innerHTML = `سکور: ${score}`;
        loadQuestion();
        showToast('گیم دوبارہ شروع ہوگئی');
    };
    
    loadQuestion();
}

// ============================================
// SECTION 37: WAY 26 - GUESS ZOOM
// ============================================
function renderGuessZoom(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    let currentImage = images[0];
    let zoomLevel = 0.1;
    let score = 0;
    
    const loadNewImage = () => {
        currentImage = images[Math.floor(Math.random() * images.length)];
        zoomLevel = 0.1;
        updateZoom();
    };
    
    const updateZoom = () => {
        const img = document.getElementById('guessImg');
        if (img) img.style.transform = `scale(${zoomLevel})`;
        document.getElementById('zoomPercent').innerHTML = `${Math.round(zoomLevel * 100)}% زوم`;
    };
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-magnifying-glass"></i> اندازہ لگائیں</h3>
            <div style="overflow: hidden; width: 300px; height: 300px; margin: 20px auto; border-radius: 15px; background: var(--bg-primary);">
                <img id="guessImg" src="${currentImage}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;">
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
                <button id="zoomInGuess" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">➕ زوم ان</button>
                <button id="zoomOutGuess" style="padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">➖ زوم آؤٹ</button>
                <button id="submitGuess" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">✅ جواب دیں</button>
            </div>
            <p id="zoomPercent">10% زوم</p>
            <div id="guessResult" style="margin: 15px 0;"></div>
            <div id="guessScore" style="margin: 10px 0;">سکور: ${score}</div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const correctAnswer = currentLetterObj ? currentLetterObj.name : '?';
    
    document.getElementById('zoomInGuess').onclick = () => {
        zoomLevel = Math.min(zoomLevel + 0.1, 1);
        updateZoom();
    };
    
    document.getElementById('zoomOutGuess').onclick = () => {
        zoomLevel = Math.max(zoomLevel - 0.1, 0.1);
        updateZoom();
    };
    
    document.getElementById('submitGuess').onclick = () => {
        const userGuess = prompt('یہ تصویر کس حرف کی ہے؟ اپنا جواب لکھیں', '');
        if (userGuess && userGuess.trim() === correctAnswer) {
            score++;
            document.getElementById('guessScore').innerHTML = `سکور: ${score}`;
            document.getElementById('guessResult').innerHTML = '<span style="color: green;">✅ صحیح! بہت خوب!</span>';
            showToast('صحیح جواب!');
            showFloatingNotification('واہ! آپ نے پہچان لیا!');
            loadNewImage();
        } else {
            document.getElementById('guessResult').innerHTML = `<span style="color: red;">❌ غلط! صحیح جواب ہے: ${correctAnswer}</span>`;
            showToast('غلط جواب!');
        }
        setTimeout(() => { document.getElementById('guessResult').innerHTML = ''; }, 2000);
    };
}

// ============================================
// SECTION 38: WAY 27 - TRACE LETTER
// ============================================
function renderTrace(container, images) {
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : 'الف';
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-pen-fancy"></i> حرف لکھیں اور ٹریس کریں</h3>
            <canvas id="traceCanvas" width="350" height="250" style="border: 2px solid var(--border-color); border-radius: 15px; margin: 20px auto; background: white; cursor: crosshair;"></canvas>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
                <button id="clearTrace" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">صاف کریں</button>
                <button id="checkTrace" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">✅ چیک کریں</button>
            </div>
            <div id="traceResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const canvas = document.getElementById('traceCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    // Draw guide lines
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 50);
        ctx.lineTo(canvas.width, i * 50);
        ctx.stroke();
    }
    
    // Draw sample letter
    ctx.font = 'bold 60px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq"';
    ctx.fillStyle = '#ddd';
    ctx.fillText(letterName, canvas.width / 2 - 30, canvas.height / 2 + 20);
    
    canvas.onmousedown = () => { drawing = true; ctx.beginPath(); ctx.strokeStyle = '#3498db'; ctx.lineWidth = 5; ctx.lineCap = 'round'; };
    canvas.onmouseup = () => { drawing = false; };
    canvas.onmousemove = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    
    canvas.ontouchstart = (e) => { e.preventDefault(); drawing = true; ctx.beginPath(); };
    canvas.ontouchend = (e) => { e.preventDefault(); drawing = false; };
    canvas.ontouchmove = (e) => {
        e.preventDefault();
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    
    document.getElementById('clearTrace').onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw guide lines
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 50);
            ctx.lineTo(canvas.width, i * 50);
            ctx.stroke();
        }
        ctx.font = 'bold 60px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq"';
        ctx.fillStyle = '#ddd';
        ctx.fillText(letterName, canvas.width / 2 - 30, canvas.height / 2 + 20);
        showToast('کینوس صاف ہوگیا');
    };
    
    document.getElementById('checkTrace').onclick = () => {
        showToast('بہت خوب! آپ نے حرف لکھنے کی مشق کی!');
        showFloatingNotification('واہ! آپ نے حرف لکھ لیا!');
        document.getElementById('traceResult').innerHTML = '<span style="color: green;">✅ بہت خوب! مشق جاری رکھیں</span>';
    };
}

// ============================================
// SECTION 39: WAY 28 - EMOJI STORY
// ============================================
function renderEmojiStory(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const emojis = ['😊', '🐶', '🐱', '🐦', '🐟', '🐘', '🦁', '🐒', '🐬', '🦋', '🌺', '🍎', '⭐', '🌙', '☀️'];
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-smile-wink"></i> ایموجی کہانی</h3>
            <img src="${randomImg}" style="max-width: 250px; border-radius: 15px; margin: 20px auto;">
            <p style="margin: 15px 0;">اس تصویر کے لیے ایموجی کہانی بنائیں</p>
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 20px 0;" id="emojiPalette">
                ${emojis.map(emoji => `<span style="font-size: 2rem; cursor: pointer; padding: 5px;" onclick="addEmoji('${emoji}')">${emoji}</span>`).join('')}
            </div>
            <div style="margin: 20px 0;">
                <h4>آپ کی کہانی</h4>
                <div id="emojiStoryList" style="min-height: 80px; background: var(--bg-primary); border-radius: 15px; padding: 15px; font-size: 1.5rem;"></div>
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button id="clearEmojiStory" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">صاف کریں</button>
                    <button id="saveEmojiStory" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">محفوظ کریں</button>
                </div>
            </div>
            <div id="emojiResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    let emojiStory = [];
    
    window.addEmoji = (emoji) => {
        emojiStory.push(emoji);
        document.getElementById('emojiStoryList').innerHTML = emojiStory.join(' ');
        showToast(`ایموجی شامل ہوگیا: ${emoji}`);
    };
    
    document.getElementById('clearEmojiStory').onclick = () => {
        emojiStory = [];
        document.getElementById('emojiStoryList').innerHTML = '';
        showToast('کہانی صاف ہوگئی');
    };
    
    document.getElementById('saveEmojiStory').onclick = () => {
        if (emojiStory.length > 0) {
            localStorage.setItem('emojiStory', JSON.stringify(emojiStory));
            document.getElementById('emojiResult').innerHTML = '<span style="color: green;">✅ کہانی محفوظ ہوگئی!</span>';
            showToast('آپ کی ایموجی کہانی محفوظ ہوگئی!');
            showFloatingNotification('واہ! بہت تخلیقی کہانی ہے!');
        } else {
            showToast('براہ کرم کچھ ایموجیز منتخب کریں');
        }
    };
}

// ============================================
// SECTION 40: WAY 29 - STORY ORDER
// ============================================
function renderStoryOrder(container, images) {
    if (!images || images.length < 3) {
        container.innerHTML = '<div style="text-align:center;padding:40px">کم از کم 3 تصاویر درکار ہیں</div>';
        return;
    }
    
    let correctOrder = images.slice(0, 4);
    let currentOrder = [...correctOrder];
    for (let i = currentOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentOrder[i], currentOrder[j]] = [currentOrder[j], currentOrder[i]];
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-sort-amount-down"></i> کہانی کو ترتیب دیں</h3>
            <p style="margin: 10px 0;">تصاویر کو صحیح ترتیب میں لگائیں تاکہ کہانی بنے</p>
            <div id="storyOrderList" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 20px auto;"></div>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
                <button id="checkOrder" style="padding: 10px 20px; background: var(--success-color, #2ecc71); color: white; border: none; border-radius: 10px; cursor: pointer;">✅ چیک کریں</button>
                <button id="resetOrder" style="padding: 10px 20px; background: var(--warning-color, #f39c12); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 شفل</button>
            </div>
            <div id="orderResult" style="margin: 15px 0;"></div>
            <button onclick="closeWayModal()" style="padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    const renderOrderList = () => {
        const list = document.getElementById('storyOrderList');
        list.innerHTML = currentOrder.map((img, i) => `
            <div draggable="true" data-index="${i}" style="display: flex; align-items: center; gap: 15px; background: var(--bg-primary); padding: 10px; border-radius: 10px; cursor: grab;">
                <span style="font-size: 1.2rem;">☰</span>
                <span style="background: var(--primary-color); color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${i + 1}</span>
                <img src="${img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            </div>
        `).join('');
        
        const items = document.querySelectorAll('#storyOrderList > div');
        items.forEach(item => {
            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.index);
                item.style.opacity = '0.5';
            };
            item.ondragend = (e) => { item.style.opacity = '1'; };
            item.ondragover = (e) => { e.preventDefault(); };
            item.ondrop = (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = parseInt(item.dataset.index);
                if (fromIndex !== toIndex) {
                    const temp = currentOrder[fromIndex];
                    currentOrder[fromIndex] = currentOrder[toIndex];
                    currentOrder[toIndex] = temp;
                    renderOrderList();
                }
            };
        });
    };
    
    document.getElementById('checkOrder').onclick = () => {
        let correct = true;
        for (let i = 0; i < currentOrder.length; i++) {
            if (currentOrder[i] !== correctOrder[i]) {
                correct = false;
                break;
            }
        }
        if (correct) {
            document.getElementById('orderResult').innerHTML = '<span style="color: green; font-size: 1.1rem;">✅ صحیح! آپ نے کہانی کو درست ترتیب دیا!</span>';
            showToast('صحیح ترتیب!');
            showFloatingNotification('واہ! کہانی ترتیب دے دی!');
        } else {
            document.getElementById('orderResult').innerHTML = '<span style="color: red;">❌ غلط ترتیب! دوبارہ کوشش کریں</span>';
            showToast('غلط ترتیب، دوبارہ کوشش کریں');
        }
    };
    
    document.getElementById('resetOrder').onclick = () => {
        for (let i = currentOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentOrder[i], currentOrder[j]] = [currentOrder[j], currentOrder[i]];
        }
        renderOrderList();
        document.getElementById('orderResult').innerHTML = '';
        showToast('ترتیب شفل ہوگئی');
    };
    
    renderOrderList();
}

// ============================================
// SECTION 41: WAY 30 - SPOT LETTER
// ============================================
function renderSpotLetter(container, images) {
    if (!images || images.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px">تصاویر دستیاب نہیں</div>';
        return;
    }
    
    const currentLetterObj = alphabetList.find(l => l.id === currentLetter);
    const letterName = currentLetterObj ? currentLetterObj.name : '?';
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    // Create a grid of letters
    const allLetters = alphabetList.map(l => l.name);
    const gridLetters = [letterName, ...allLetters.filter(l => l !== letterName).slice(0, 8)];
    for (let i = gridLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gridLetters[i], gridLetters[j]] = [gridLetters[j], gridLetters[i]];
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3><i class="fas fa-search"></i> حرف ڈھونڈیں</h3>
            <img src="${randomImg}" style="max-width: 250px; border-radius: 15px; margin: 20px auto;">
            <p style="margin: 15px 0;">اس تصویر میں چھپا حرف <strong style="font-size: 1.3rem;">${letterName}</strong> ڈھونڈیں</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 300px; margin: 20px auto;">
                ${gridLetters.map(letter => `
                    <div class="spot-letter" data-letter="${letter}" style="background: var(--bg-primary); padding: 15px; border-radius: 10px; cursor: pointer; font-size: 1.5rem; text-align: center;">${letter}</div>
                `).join('')}
            </div>
            <div id="spotResult" style="margin: 15px 0;"></div>
            <button id="newSpotImage" style="margin: 10px; padding: 10px 20px; background: var(--primary-color, #3498db); color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 نئی تصویر</button>
            <button onclick="closeWayModal()" style="margin: 10px; padding: 10px 20px; background: var(--secondary-color, #e74c3c); color: white; border: none; border-radius: 10px; cursor: pointer;">بند کریں</button>
        </div>
    `;
    
    let found = false;
    
    document.querySelectorAll('.spot-letter').forEach(btn => {
        btn.onclick = () => {
            if (found) return;
            if (btn.dataset.letter === letterName) {
                btn.style.background = '#2ecc71';
                document.getElementById('spotResult').innerHTML = '<span style="color: green; font-size: 1.1rem;">✅ مبارک ہو! آپ نے صحیح حرف ڈھونڈ لیا!</span>';
                showToast('صحیح! آپ نے حرف ڈھونڈ لیا!');
                showFloatingNotification('واہ! آپ نے حرف پہچان لیا!');
                found = true;
            } else {
                btn.style.background = '#e74c3c';
                showToast('غلط! دوبارہ کوشش کریں');
                setTimeout(() => { btn.style.background = 'var(--bg-primary)'; }, 500);
            }
        };
    });
    
    document.getElementById('newSpotImage').onclick = () => {
        const newRandomImg = images[Math.floor(Math.random() * images.length)];
        const img = container.querySelector('img');
        if (img) img.src = newRandomImg;
        found = false;
        document.getElementById('spotResult').innerHTML = '';
        document.querySelectorAll('.spot-letter').forEach(btn => {
            btn.style.background = 'var(--bg-primary)';
        });
        showToast('نئی تصویر لوڈ ہوگئی');
    };
}
