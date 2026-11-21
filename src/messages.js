// One English key per line, followed by Hindi and Gujarati.
const rows = `
Language|भाषा|ભાષા
College demo · Simulated purchases|कॉलेज डेमो · नकली खरीद प्रक्रिया|કૉલેજ ડેમો · ખરીદીનું નિદર્શન
Rural craft purchasing|ग्रामीण हस्तशिल्प की खरीद|ગ્રામીણ હસ્તકલાની ખરીદી
Publish a craft listing at the Kendra, send offers as a buyer, and review them as the artisan.|केंद्र पर शिल्प की सूची प्रकाशित करें, खरीदार बनकर प्रस्ताव भेजें और कारीगर बनकर उन्हें देखें।|કેન્દ્ર પર હસ્તકલાની વેચાણ નોંધ પ્રકાશિત કરો, ખરીદદાર તરીકે પ્રસ્તાવ મોકલો અને કારીગર તરીકે તે જુઓ.
Access resources|सहायता संसाधन|સહાય સાધનો
Demo role|डेमो भूमिका|ડેમોની ભૂમિકા
Kendra operator|केंद्र संचालक|કેન્દ્ર સંચાલક
Buyer 1|खरीदार 1|ખરીદદાર 1
Buyer 2|खरीदार 2|ખરીદદાર 2
Buyer|खरीदार|ખરીદદાર
Artisan|कारीगर|કારીગર
{role} workspace|{role} का कार्यक्षेत्र|{role}નું કાર્યક્ષેત્ર
Kiran Patel|किरण पटेल|કિરણ પટેલ
Bhuj Jan Suvidha Kendra|भुज जन सुविधा केंद्र|ભુજ જન સુવિધા કેન્દ્ર
District Handicrafts Office|जिला हस्तशिल्प कार्यालय|જિલ્લા હસ્તકલા કાર્યાલય
State Craft Emporium|राज्य हस्तशिल्प बिक्री केंद्र|રાજ્ય હસ્તકલા વેચાણ કેન્દ્ર
Reset demo|डेमो रीसेट करें|ડેમો ફરીથી શરૂ કરો
Reset all profiles, listings, offers, and orders to the demo defaults?|सभी प्रोफ़ाइल, सूचियाँ, प्रस्ताव और आदेश मूल डेमो स्थिति में लौटाएँ?|બધી પ્રોફાઇલ, વેચાણ નોંધો, પ્રસ્તાવો અને ઓર્ડર મૂળ ડેમો સ્થિતિમાં પાછાં મૂકવા?
Demo reset.|डेमो रीसेट हो गया।|ડેમો ફરીથી શરૂ થયો.
Artisan profile selected.|कारीगर की प्रोफ़ाइल चुनी गई।|કારીગરની પ્રોફાઇલ પસંદ થઈ.
Artisan registered. You can now create a listing.|कारीगर पंजीकृत है। अब आप उत्पाद सूची बना सकते हैं।|કારીગરની નોંધણી થઈ. હવે તમે વેચાણ નોંધ બનાવી શકો છો.
Create a listing for {name}|{name} के लिए सूची बनाएँ|{name} માટે વેચાણ નોંધ બનાવો
Listings and offer comparison|सूचियाँ और प्रस्तावों की तुलना|વેચાણ નોંધો અને પ્રસ્તાવોની સરખામણી
Product listings|उत्पाद सूचियाँ|ઉત્પાદનોની વેચાણ નોંધો
Product name|उत्पाद का नाम|ઉત્પાદનનું નામ
Craft category|शिल्प की श्रेणी|હસ્તકલાનો પ્રકાર
Quantity|संख्या|જથ્થો
Asking price per piece (₹)|प्रति नग माँगा गया मूल्य (₹)|નંગ દીઠ માંગેલી કિંમત (₹)
Save draft|मसौदा सहेजें|મસૂદો સાચવો
Draft saved for {name}.|{name} के लिए मसौदा सहेजा गया।|{name} માટે મસૂદો સાચવ્યો.
Published {name}.|{name} प्रकाशित किया गया।|{name} પ્રકાશિત કર્યું.
Publish listing|सूची प्रकाशित करें|વેચાણ નોંધ પ્રકાશિત કરો
No listings yet.|अभी कोई सूची नहीं है।|હજુ કોઈ વેચાણ નોંધ નથી.
Bandhani dupattas|बांधनी दुपट्टे|બાંધણીના દુપટ્ટા
Embroidered pouches|कढ़ाई वाली थैलियाँ|ભરતકામ કરેલી થેલીઓ
Handwoven baskets|हाथ से बुनी टोकरियाँ|હાથથી વણેલી ટોપલીઓ
Textiles|कपड़ा|કાપડ
Embroidery|कढ़ाई|ભરતકામ
Basketry|टोकरी बुनाई|ટોપલી વણાટ
draft|मसौदा|મસૂદો
published|प्रकाशित|પ્રકાશિત
per piece|प्रति नग|નંગ દીઠ
Per piece|प्रति नग|નંગ દીઠ
Available|उपलब्ध|ઉપલબ્ધ
Reserved|आरक्षित|અનામત
Purchased|खरीदे गए|ખરીદાયેલા
Held for return|वापसी के लिए रखे गए|પરત કરવા રાખેલા
Make an offer|खरीद प्रस्ताव दें|ખરીદીનો પ્રસ્તાવ આપો
Cancel offer form|प्रस्ताव फ़ॉर्म बंद करें|પ્રસ્તાવનું ફોર્મ બંધ કરો
Offer for {name}|{name} के लिए प्रस्ताव|{name} માટે પ્રસ્તાવ
Offer quantity|प्रस्तावित संख्या|પ્રસ્તાવિત જથ્થો
Offer price per piece (₹)|प्रस्तावित प्रति नग मूल्य (₹)|પ્રસ્તાવિત નંગ દીઠ કિંમત (₹)
Total deduction (₹)|कुल कटौती (₹)|કુલ કપાત (₹)
Send offer|प्रस्ताव भेजें|પ્રસ્તાવ મોકલો
Offer sent to {name}.|प्रस्ताव {name} को भेज दिया गया।|પ્રસ્તાવ {name}ને મોકલ્યો.
Accepted|स्वीकृत|સ્વીકારાયેલ
Insufficient stock|पर्याप्त माल नहीं|પૂરતો જથ્થો નથી
Pending|लंबित|બાકી
Pieces|नग|નંગ
Deduction|कटौती|કપાત
Artisan receives|कारीगर को मिलने वाली राशि|કારીગરને મળનારી રકમ
Accept offer|प्रस्ताव स्वीकार करें|પ્રસ્તાવ સ્વીકારો
Offer accepted. Purchase order created and stock reserved.|प्रस्ताव स्वीकार हुआ। खरीद आदेश बना और माल आरक्षित हुआ।|પ્રસ્તાવ સ્વીકારાયો. ખરીદીનો ઓર્ડર બન્યો અને જથ્થો અનામત થયો.
No offers yet.|अभी कोई प्रस्ताव नहीं है।|હજુ કોઈ પ્રસ્તાવ નથી.
Purchase orders|खरीद आदेश|ખરીદીના ઓર્ડર
Orders appear here after the artisan accepts an offer.|कारीगर के प्रस्ताव स्वीकार करने के बाद आदेश यहाँ दिखेंगे।|કારીગર પ્રસ્તાવ સ્વીકારે પછી ઓર્ડર અહીં દેખાશે.
Order for {name}|{name} का आदेश|{name}નો ઓર્ડર
Order|आदेश|ઓર્ડર
Order ID|आदेश आईडी|ઓર્ડર આઈડી
Ordered|आदेश की संख्या|ઓર્ડરનો જથ્થો
{count} pieces|{count} नग|{count} નંગ
Agreed price|तय मूल्य|નક્કી કરેલી કિંમત
Agreed deduction|तय कटौती|નક્કી કરેલી કપાત
Adjusted deduction|संशोधित कटौती|સુધારેલી કપાત
Estimated payout|अनुमानित भुगतान|અંદાજિત ચુકવણી
Inspected payout|जाँच के बाद देय राशि|તપાસ પછીની ચુકવણી
Payout status|भुगतान की स्थिति|ચુકવણીની સ્થિતિ
Estimated|अनुमानित|અંદાજિત
Paid (simulated)|भुगतान दर्ज (डेमो)|ચુકવણી નોંધાઈ (ડેમો)
Payment pending|भुगतान लंबित|ચુકવણી બાકી
No payout due|कोई भुगतान देय नहीं|કોઈ ચુકવણી બાકી નથી
Inspected|जाँच पूरी हुई|તપાસ પૂરી થઈ
Collected|माल लिया गया|માલ લઈ લીધો
Collection scheduled|माल लेने की तारीख तय|માલ લેવાની તારીખ નક્કી
Awaiting collection schedule|माल लेने की तारीख तय होना बाकी|માલ લેવાની તારીખ નક્કી થવાની બાકી
Collection date|माल लेने की तारीख|માલ લેવાની તારીખ
Collection centre|माल लेने का केंद्र|માલ લેવાનું કેન્દ્ર
Collection at {centre} on {date}.|{date} को {centre} पर माल लिया जाएगा।|{date}ના રોજ {centre} ખાતે માલ લેવાનો છે.
Schedule collection at Kendra|केंद्र पर माल लेने की तारीख तय करें|કેન્દ્ર પર માલ લેવાની તારીખ નક્કી કરો
Collection scheduled.|माल लेने की तारीख तय हो गई।|માલ લેવાની તારીખ નક્કી થઈ.
Mark collected|माल मिलने की पुष्टि करें|માલ મળ્યાની નોંધ કરો
Collection recorded.|माल मिलने की पुष्टि दर्ज हुई।|માલ મળ્યાની નોંધ થઈ.
Accepted pieces|स्वीकृत नग|સ્વીકારેલા નંગ
Rejected pieces|अस्वीकृत नग|નકારેલા નંગ
Rejection reason|अस्वीकृति का कारण|નકારવાનું કારણ
Reason if any pieces are rejected|नग अस्वीकृत होने पर कारण बताएँ|નંગ નકાર્યા હોય તો કારણ લખો
Record inspection|जाँच दर्ज करें|તપાસ નોંધો
Inspection recorded.|जाँच दर्ज हो गई।|તપાસ નોંધાઈ.
Inspection: {accepted} accepted, {rejected} rejected.|जाँच में {accepted} स्वीकृत और {rejected} अस्वीकृत।|તપાસમાં {accepted} સ્વીકાર્યા અને {rejected} નકાર્યા.
Rejection reason: {reason}. Rejected pieces are held for return.|अस्वीकृति का कारण: {reason}। अस्वीकृत नग वापसी के लिए रखे गए हैं।|નકારવાનું કારણ: {reason}. નકારેલા નંગ પરત કરવા રાખ્યા છે.
Mark payout paid|भुगतान दर्ज करें|ચુકવણી નોંધો
Simulated payment recorded.|डेमो भुगतान दर्ज हो गया।|ડેમોની ચુકવણી નોંધાઈ.
Resale stock|दोबारा बिक्री के लिए माल|ફરી વેચવા માટેનો જથ્થો
KalaSetu Craft Exhibition|कलासेतु शिल्प प्रदर्शनी|કલાસેતુ હસ્તકલા પ્રદર્શન
{count} pieces allocated to {channel}.|{count} नग {channel} के लिए आवंटित किए गए।|{count} નંગ {channel} માટે ફાળવ્યા.
{count} unallocated pieces · {channel}|{count} नग आवंटन के लिए बाकी · {channel}|{count} નંગ ફાળવવાના બાકી · {channel}
Allocate to exhibition|प्रदर्शनी के लिए आवंटित करें|પ્રદર્શન માટે ફાળવો
Stock allocated.|माल आवंटित हो गया।|જથ્થો ફાળવાયો.
Record the payout before allocating stock.|माल आवंटित करने से पहले भुगतान दर्ज करें।|જથ્થો ફાળવતાં પહેલાં ચુકવણી નોંધો.
Browser storage is unavailable. Changes last until reload.|ब्राउज़र में सहेजना उपलब्ध नहीं है। पेज दोबारा खोलने तक बदलाव रहेंगे।|બ્રાઉઝરમાં સાચવી શકાતું નથી. પેજ ફરી લોડ થાય ત્યાં સુધી ફેરફાર રહેશે.
Demo listings, offers, and orders are saved in this browser.|डेमो की सूचियाँ, प्रस्ताव और आदेश इसी ब्राउज़र में सहेजे जाते हैं।|ડેમોની વેચાણ નોંધો, પ્રસ્તાવો અને ઓર્ડર આ બ્રાઉઝરમાં સાચવાય છે.
Find a Kendra|नज़दीकी केंद्र खोजें|નજીકનું કેન્દ્ર શોધો
Search by village, district, or PIN code. Confirm the centre address, hours, and available services before visiting.|गाँव, ज़िला या पिन कोड से खोजें। जाने से पहले पता, समय और उपलब्ध सेवाएँ पूछ लें।|ગામ, જિલ્લા કે પિન કોડથી શોધો. જતાં પહેલાં સરનામું, સમય અને ઉપલબ્ધ સેવાઓની ખાતરી કરો.
Village, district, or PIN code|गाँव, ज़िला या पिन कोड|ગામ, જિલ્લો અથવા પિન કોડ
Search Jan Suvidha Kendra on Google Maps|Google Maps पर जन सुविधा केंद्र खोजें|Google Maps પર જન સુવિધા કેન્દ્ર શોધો
Search Common Service Centres on Google Maps|Google Maps पर कॉमन सर्विस सेंटर खोजें|Google Maps પર કોમન સર્વિસ સેન્ટર શોધો
Open CSC locator|CSC केंद्र खोजने की वेबसाइट खोलें|CSC કેન્દ્ર શોધવાની વેબસાઇટ ખોલો
Selected centre name and address|चुने हुए केंद्र का नाम और पता|પસંદ કરેલા કેન્દ્રનું નામ અને સરનામું
Get directions on Google Maps|Google Maps पर रास्ता देखें|Google Maps પર રસ્તો જુઓ
Map results and the CSC directory are external. Ask the centre which services it provides.|मानचित्र के नतीजे और CSC निर्देशिका बाहरी सेवाएँ हैं। केंद्र से उसकी सेवाओं के बारे में पूछें।|નકશાનાં પરિણામો અને CSC ડિરેક્ટરી બાહ્ય સેવાઓ છે. કેન્દ્ર કઈ સેવાઓ આપે છે તે પૂછો.
Artisan profile|कारीगर की प्रोफ़ाइल|કારીગરની પ્રોફાઇલ
Print registration slip|पंजीकरण पर्ची छापें|નોંધણીની પાવતી છાપો
Register an artisan at the Kendra|केंद्र पर कारीगर का पंजीकरण करें|કેન્દ્ર પર કારીગરની નોંધણી કરો
Artisan name|कारीगर का नाम|કારીગરનું નામ
Village or locality|गाँव या इलाका|ગામ અથવા વિસ્તાર
Preferred language|पसंद की भाषा|પસંદગીની ભાષા
The artisan agrees to register this sample profile.|कारीगर इस नमूना प्रोफ़ाइल के पंजीकरण के लिए सहमत है।|કારીગર આ નમૂનાની પ્રોફાઇલ નોંધાવવા સંમત છે.
Use sample details for this college demo.|इस कॉलेज डेमो में नमूना जानकारी भरें।|આ કૉલેજ ડેમો માટે નમૂનાની વિગતો લખો.
Register artisan|कारीगर का पंजीकरण करें|કારીગરની નોંધણી કરો
Registration slip|पंजीकरण पर्ची|નોંધણીની પાવતી
Artisan ID|कारीगर आईडी|કારીગર આઈડી
Listing ID|सूची की आईडी|વેચાણ નોંધની આઈડી
Listing confirmation|सूची प्रकाशन की पुष्टि|વેચાણ નોંધની પુષ્ટિ
Print listing confirmation|सूची की पुष्टि छापें|વેચાણ નોંધની પુષ્ટિ છાપો
Purchase order|खरीद आदेश|ખરીદીનો ઓર્ડર
Print purchase order|खरीद आदेश छापें|ખરીદીનો ઓર્ડર છાપો
Packing checklist|पैकिंग की जाँच सूची|પેકિંગની યાદી
Print packing checklist|पैकिंग की सूची छापें|પેકિંગની યાદી છાપો
Count the pieces against the order.|आदेश में दी गई संख्या से नग मिलाएँ।|ઓર્ડર પ્રમાણે નંગ ગણી લો.
Wrap the pieces and label the parcel with the order ID.|नग पैक करें और पार्सल पर आदेश आईडी लिखें।|નંગ પેક કરો અને પાર્સલ પર ઓર્ડર આઈડી લખો.
Bring the parcel to the collection centre on the scheduled date.|तय तारीख को पार्सल केंद्र पर लाएँ।|નક્કી કરેલી તારીખે પાર્સલ કેન્દ્ર પર લાવો.
Inspection record|जाँच का रिकॉर्ड|તપાસની નોંધ
Print inspection record|जाँच का रिकॉर्ड छापें|તપાસની નોંધ છાપો
Handover receipt|माल सौंपने की रसीद|માલ સોંપ્યાની પાવતી
Print handover receipt|माल सौंपने की रसीद छापें|માલ સોંપ્યાની પાવતી છાપો
Payment acknowledgement|भुगतान की पावती|ચુકવણીની પાવતી
Print payment acknowledgement|भुगतान की पावती छापें|ચુકવણીની પાવતી છાપો
Sample · College project|नमूना · कॉलेज परियोजना|નમૂનો · કૉલેજ પ્રોજેક્ટ
Step-by-step guides|चरण-दर-चरण मार्गदर्शिका|પગલુંવાર માર્ગદર્શિકા
Before you visit|जाने से पहले|મુલાકાત પહેલાં
Artisan guide|कारीगर की मार्गदर्शिका|કારીગરની માર્ગદર્શિકા
Kendra operator guide|केंद्र संचालक की मार्गदर्शिका|કેન્દ્ર સંચાલકની માર્ગદર્શિકા
Buyer guide|खरीदार की मार्गदर्शिका|ખરીદદારની માર્ગદર્શિકા
Find a centre and confirm the address and services.|केंद्र खोजें और पता व सेवाएँ पूछ लें।|કેન્દ્ર શોધો અને સરનામા તથા સેવાઓની ખાતરી કરો.
Bring a sample or clear photos, the quantity ready, and your asking price.|नमूना या साफ़ तस्वीरें लाएँ और उपलब्ध संख्या व माँगा गया मूल्य बताएँ।|નમૂનો અથવા સ્પષ્ટ ફોટા લાવો અને તૈયાર જથ્થો તથા માંગેલી કિંમત જણાવો.
Ask the Kendra operator to register your sample profile and prepare a listing.|केंद्र संचालक से अपनी नमूना प्रोफ़ाइल दर्ज करने और सूची बनाने को कहें।|કેન્દ્ર સંચાલકને તમારી નમૂનાની પ્રોફાઇલ નોંધવા અને વેચાણ નોંધ બનાવવા કહો.
Review the price and stock with the operator before the listing is published.|सूची प्रकाशित करने से पहले संचालक के साथ मूल्य और माल की संख्या जाँचें।|વેચાણ નોંધ પ્રકાશિત થાય તે પહેલાં સંચાલક સાથે કિંમત અને જથ્થો તપાસો.
Open your artisan profile to compare offers and track collection and payout.|प्रस्तावों की तुलना और माल लेने व भुगतान की स्थिति देखने के लिए अपनी प्रोफ़ाइल खोलें।|પ્રસ્તાવોની સરખામણી અને માલની પ્રાપ્તિ તથા ચુકવણીની સ્થિતિ જોવા તમારી પ્રોફાઇલ ખોલો.
Ask permission, register the artisan, and print the registration slip.|अनुमति लें, कारीगर का पंजीकरण करें और पर्ची छापें।|પરવાનગી લો, કારીગરની નોંધણી કરો અને પાવતી છાપો.
Select the artisan profile, save a draft, and review the details together.|कारीगर की प्रोफ़ाइल चुनें, मसौदा सहेजें और साथ में विवरण जाँचें।|કારીગરની પ્રોફાઇલ પસંદ કરો, મસૂદો સાચવો અને સાથે વિગતો તપાસો.
Publish the listing after the artisan confirms the price and quantity.|कारीगर के मूल्य और संख्या की पुष्टि करने पर सूची प्रकाशित करें।|કારીગર કિંમત અને જથ્થાની પુષ્ટિ કરે પછી વેચાણ નોંધ પ્રકાશિત કરો.
Choose a published listing and send an offer with quantity, price, and deduction.|प्रकाशित सूची चुनें और संख्या, मूल्य व कटौती के साथ प्रस्ताव भेजें।|પ્રકાશિત વેચાણ નોંધ પસંદ કરો અને જથ્થા, કિંમત તથા કપાત સાથે પ્રસ્તાવ મોકલો.
Once the artisan accepts, schedule collection and record the inspection.|कारीगर की स्वीकृति के बाद माल लेने की तारीख तय करें और जाँच दर्ज करें।|કારીગર સ્વીકારે પછી માલ લેવાની તારીખ નક્કી કરો અને તપાસ નોંધો.
Record the simulated payment and allocate accepted stock to the exhibition.|डेमो भुगतान दर्ज करें और स्वीकृत माल प्रदर्शनी के लिए आवंटित करें।|ડેમોની ચુકવણી નોંધો અને સ્વીકારેલો જથ્થો પ્રદર્શન માટે ફાળવો.
Print visit checklist|यात्रा की तैयारी सूची छापें|મુલાકાતની તૈયારીની યાદી છાપો
Enter the artisan name and locality, choose a language, and confirm consent.|कारीगर का नाम और इलाका भरें, भाषा चुनें और सहमति की पुष्टि करें।|કારીગરનું નામ અને વિસ્તાર લખો, ભાષા પસંદ કરો અને સંમતિની પુષ્ટિ કરો.
Enter a product name, craft category, positive whole quantity, and valid price.|उत्पाद का नाम, श्रेणी, पूरी धनात्मक संख्या और सही मूल्य भरें।|ઉત્પાદનનું નામ, પ્રકાર, શૂન્યથી મોટો પૂર્ણ જથ્થો અને માન્ય કિંમત લખો.
Choose a draft to publish.|प्रकाशित करने के लिए मसौदा चुनें।|પ્રકાશિત કરવા માટે મસૂદો પસંદ કરો.
Choose a published product.|प्रकाशित उत्पाद चुनें।|પ્રકાશિત ઉત્પાદન પસંદ કરો.
Choose a demo buyer.|डेमो खरीदार चुनें।|ડેમો ખરીદદાર પસંદ કરો.
Enter a whole quantity within the available stock.|उपलब्ध माल के भीतर पूरी संख्या भरें।|ઉપલબ્ધ જથ્થાની અંદર પૂર્ણ સંખ્યા લખો.
Enter a valid unit price and a deduction smaller than the gross amount.|सही प्रति नग मूल्य और कुल राशि से कम कटौती भरें।|માન્ય નંગ દીઠ કિંમત અને કુલ રકમ કરતાં ઓછી કપાત લખો.
Only pending offers can be accepted.|केवल लंबित प्रस्ताव स्वीकार किए जा सकते हैं।|ફક્ત બાકી પ્રસ્તાવો સ્વીકારી શકાય છે.
The offer exceeds the remaining stock.|प्रस्ताव शेष माल से अधिक है।|પ્રસ્તાવ બાકી જથ્થા કરતાં વધારે છે.
Collection is already scheduled.|माल लेने की तारीख पहले से तय है।|માલ લેવાની તારીખ પહેલેથી નક્કી છે.
Choose a valid collection date.|माल लेने की सही तारीख चुनें।|માલ લેવાની માન્ય તારીખ પસંદ કરો.
Choose today or a future date for collection.|माल लेने के लिए आज या आगे की तारीख चुनें।|માલ લેવા માટે આજની અથવા આવનારી તારીખ પસંદ કરો.
Collection must be scheduled and pending.|माल लेने की तारीख तय और कार्रवाई लंबित होनी चाहिए।|માલ લેવાની તારીખ નક્કી થયેલી હોવી જોઈએ અને માલ લેવાનો બાકી હોવો જોઈએ.
Collect the order before recording its first inspection.|पहली जाँच दर्ज करने से पहले माल लें।|પહેલી તપાસ નોંધતાં પહેલાં માલ લો.
Enter an accepted quantity within the order size.|आदेश की संख्या के भीतर स्वीकृत नग भरें।|ઓર્ડરના જથ્થાની અંદર સ્વીકારેલા નંગની સંખ્યા લખો.
Explain why the remaining pieces were rejected.|बाकी के नग अस्वीकृत करने का कारण बताएँ।|બાકીના નંગ નકારવાનું કારણ લખો.
Only a positive, unpaid inspection payout can be recorded.|जाँच के बाद की बकाया धनात्मक राशि का ही भुगतान दर्ज किया जा सकता है।|તપાસ પછીની શૂન્યથી વધુ બાકી રકમની જ ચુકવણી નોંધી શકાય.
Only unallocated, accepted stock with a settled payout can be allocated.|केवल स्वीकृत, बिना आवंटन वाले और भुगतान पूरे हो चुके माल का आवंटन करें।|ફક્ત સ્વીકારેલા, ફાળવવાના બાકી અને ચુકવણી પૂરી થયેલા જથ્થાની ફાળવણી કરો.
Choose an order for this buyer.|इस खरीदार का आदेश चुनें।|આ ખરીદદારનો ઓર્ડર પસંદ કરો.
`

export const messages = Object.fromEntries(rows.trim().split('\n').map(row => {
  const [key, hi, gu] = row.split('|')
  return [key, { hi, gu }]
}))
