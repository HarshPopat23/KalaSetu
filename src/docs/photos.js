import bandhani from './photos/bandhani.webp'
import bhujodi from './photos/bhujodi.webp'
import craftFair from './photos/craft-fair.webp'
import exhibition from './photos/exhibition.webp'
import lamps from './photos/lamps.webp'
import potter from './photos/potter.webp'

const commons = 'https://commons.wikimedia.org/wiki/File:'
const shareAlike = version => ['CC BY-SA ' + version, 'https://creativecommons.org/licenses/by-sa/' + version + '/']

export const photos = {
  bandhani: {
    src: bandhani, width: 800, height: 600,
    alt: 'Patterned Bandhani cloth',
    caption: 'Bandhani (Bandhej) cloth, an example of a craft product.',
    author: 'Tushar (Tusharkalra)', source: commons + 'Bandhej.JPG',
    license: ['Public domain', 'https://en.wikipedia.org/wiki/Public_domain'],
  },
  bhujodi: {
    src: bhujodi, width: 480, height: 640,
    alt: 'Handicraft items photographed in Bhujodi',
    caption: 'Bhujodi handicrafts in Gujarat, shown as examples of products a maker might describe.',
    author: 'KartikMistry', source: commons + 'Bhujodi_Handicraft_items.jpg',
    license: shareAlike('4.0'),
  },
  'craft-fair': {
    src: craftFair, width: 400, height: 254,
    alt: 'Narendra Modi at the Garvi Gurjari National Craft Fair',
    caption: 'Archival photo of Narendra Modi at the Garvi Gurjari National Craft Fair in Ahmedabad, 2014. Shown as an example of a craft fair.',
    author: 'Prime Minister’s Office, Government of India',
    source: commons + 'Narendra_Modi_inaugurating_the_Garvi_Gurjari_National_Craft_Fair_%26_Summit_in_Ahmedabad.jpg',
    license: shareAlike('2.0'),
  },
  exhibition: {
    src: exhibition, width: 800, height: 531,
    alt: 'Narendra Modi and accompanying officials at the 2015 Chennai Handloom Exhibition',
    caption: 'Archival photo from the Chennai Handloom Exhibition on 7 August 2015. The source identifies Narendra Modi and then Minister of State for Textiles Santosh Kumar Gangwar among the attendees.',
    author: 'Prime Minister’s Office, Government of India',
    source: commons + 'Narendra_Modi_visiting_the_Handloom_exhibition,_in_Chennai,_Tamil_Nadu._The_Minister_of_State_for_Textiles_(Independent_Charge),_Shri_Santosh_Kumar_Gangwar_and_the_Secretary,_Ministry_of_Textiles.jpg',
    license: ['GODL India', 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf'],
  },
  lamps: {
    src: lamps, width: 696, height: 640,
    alt: 'Terracotta lamps photographed in Kolkata',
    caption: 'Terracotta lamps photographed in Kolkata, West Bengal. A listing should make clear whether the price is for one lamp or a set.',
    author: 'Salil Kumar Mukherjee', source: commons + 'Terracotta_lamps.jpg',
    license: shareAlike('4.0'),
  },
  potter: {
    src: potter, width: 676, height: 640,
    alt: 'A potter at work alongside a finished pot',
    caption: 'A potter working with clay. The demo can represent a maker’s finished pieces as a batch.',
    author: 'Vijayaraghavan Rajendran', source: commons + 'Potter_at_his_work,_with_fully_done_pot.jpg',
    license: shareAlike('4.0'),
  },
}
