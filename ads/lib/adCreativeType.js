/**
* Copyright 2011 Facebook, Inc.
*
* You are hereby granted a non-exclusive, worldwide, royalty-free license to
* use, copy, modify, and distribute this software in source code or binary
* form for use in connection with the web services and APIs provided by
* Facebook.
*
* As with any software that integrates with the Facebook platform, your use
* of this software is subject to the Facebook Developer Principles and
* Policies [http://developers.facebook.com/policy/]. This copyright notice
* shall be included in all copies or substantial portions of the software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*
*
*/


var AD_CREATIVE_CATEGORY = {
  FACEBOOK_ADS : 'facebook_ads',
  SPONSORED_STORIES : 'sponsored_stories'
};

var AD_CREATIVE_TYPE_TS = {
    1:  'Standard',
    2:  'Fan',
    3:  'RSVP',
    4:  'Platform Context',
    5:  'Social Poll',
    6:  'Comment',
    7:  'Sample',
    8:  'Bass Platform Story',
    9:  'Bass Page Connections',
    10: 'Bass Page Checkins',
    11: 'Bass Page Posts',
    12: 'Premium Standard',
    13: 'Premium Fan',
    14: 'Premium Event',
    15: 'Premium Platform',
    16: 'Bass App Connection',
    17: 'Bass Engagement',
    18: 'Bass Buy With Friend',
    19: 'Bass Link Share',
    20: 'Bass Questions Vote',
    21: 'Questions',
    22: 'Bass Sparkbox',
    23: 'Bass Sparkbox Comment',
    24: 'Page Endorsement',
    999: 'Invalid'
};

var AD_CREATIVE_TYPE_MAP = {
  1:   tx('ads:pe:creative-type:standard'),
  2:   tx('ads:pe:creative-type:fan'),
  3:   tx('ads:pe:creative-type:rsvp'),
  4:   tx('ads:pe:creative-type:platform-context'),
  5:   tx('ads:pe:creative-type:social-poll'),
  6:   tx('ads:pe:creative-type:comment'),
  7:   tx('ads:pe:creative-type:sample'),
  8:   tx('ads:pe:creative-type:bass-platform-story'),
  9:   tx('ads:pe:creative-type:bass-page-connections'),
  10:  tx('ads:pe:creative-type:bass-page-checkins'),
  11:  tx('ads:pe:creative-type:bass-page-posts'),
  12:  tx('ads:pe:creative-type:premium-standard'),
  13:  tx('ads:pe:creative-type:premium-fan'),
  14:  tx('ads:pe:creative-type:premium-event'),
  15:  tx('ads:pe:creative-type:premium-platform'),
  16:  tx('ads:pe:creative-type:bass-app-connection'),
  17:  tx('ads:pe:creative-type:bass-engagement'),
  18:  tx('ads:pe:creative-type:bass-buy-with-friend'),
  19:  tx('ads:pe:creative-type:bass-link-share'),
  20:  tx('ads:pe:creative-type:bass-questions-vote'),
  21:  tx('ads:pe:creative-type:questions'),
  22:  tx('ads:pe:creative-type:bass-sparkbox'),
  23:  tx('ads:pe:creative-type:bass-sparkbox-comment'),
  24:  tx('ads:pe:creative-type:page-endorsement'),
  999: tx('ads:pe:creative-type:invalid')
};

var AD_CREATIVE_TYPE = {
  STANDARD: 1,
  INLINE_FAN: 2,
  INLINE_RSVP: 3,
  PLATFORM_CONTEXT: 4,
  SOCIAL_POLL: 5,
  COMMENT: 6,
  SAMPLE: 7,
  BASS_PLATFORM_STORY: 8,
  BASS_PAGE_CONNECTIONS: 9,
  BASS_PAGE_CHECKINS: 10,
  BASS_PAGE_POSTS: 11,
  PREMIUM_STANDARD: 12,
  PREMIUM_FAN: 13,
  PREMIUM_EVENT: 14,
  PREMIUM_PLATFORM: 15,
  BASS_APP_CONNECTIONS: 16,
  BASS_ENGAGEMENT: 17,
  BASS_BUY_WITH_FRIENDS: 18,
  BASS_LINK_SHARE: 19,
  BASS_QUESTIONS_VOTE: 20,
  QUESTIONS: 21,
  BASS_SPARKBOX: 22,
  BASS_SPARKBOX_COMMENT: 23,
  PAGE_ENDORSEMENT: 24,
  EXOTIC_OR_INVALID: 999
};

var AD_CREATIVE_BASS_TYPE_MAP = {
  BASS_PLATFORM_STORY: 8,
  BASS_PAGE_CONNECTIONS: 9,
  BASS_PAGE_CHECKINS: 10,
  BASS_PAGE_POSTS: 11,
  BASS_APP_CONNECTIONS: 16,
  BASS_ENGAGEMENT: 17,
  BASS_BUY_WITH_FRIENDS: 18,
  BASS_LINK_SHARE: 19,
  BASS_QUESTIONS_VOTE: 20
};

function id2string(id) {
  return AD_CREATIVE_TYPE_TS[id] || AD_CREATIVE_TYPE_TS[1];
}

var re = /[^a-z]/g;
function string2id(string) {
  string = string.toLowerCase().replace(re, '');
  var found = 1;
  try {
    require("../../uki-core/utils").forEach(AD_CREATIVE_TYPE_TS, function(text, id) {
      text = text.toLowerCase().replace(re, '');
      if (text == string) {
        found = id;
        throw 'break';
      }
    });
  } catch (e) {}
  return found;
}

function is_bass_type(creative_type) {
  return AD_CREATIVE_BASS_TYPE_MAP[creative_type];
};

function getCategoryByCreativeType(creative_type) {
  return is_bass_type(creative_type) ?
    AD_CREATIVE_CATEGORY.SPONSORED_STORIES :
    AD_CREATIVE_CATEGORY.FACEBOOK_ADS;
};

function getDefaultCreativeTypeByAnchor(
    anchor_type, is_bass, is_premium) {

  var premium = is_premium || false;
  var bass = is_bass || false;

  var default_type = is_premium ?
    AD_CREATIVE_TYPE.PREMIUM_STANDARD :
    AD_CREATIVE_TYPE.STANDARD;

  var type = require("../model/connectedObject").OBJECT_TYPE;
  if (premium) {
    if (anchor_type == type.EXTERNAL_WEBPAGE) {
      default_type = AD_CREATIVE_TYPE.PREMIUM_STANDARD;
      return;
    }
    anchor_type = parseInt(anchor_type, 10);

    switch (anchor_type) {
      case type.PAGE:
      case type.GROUP:
      case type.REVIEW:
      case type.PLACE:
        default_type = AD_CREATIVE_TYPE.PREMIUM_FAN;
        break;
      case type.EVENT:
        default_type = AD_CREATIVE_TYPE.PREMIUM_EVENT;
        break;
      case type.APP:
        default_type = AD_CREATIVE_TYPE.PREMIUM_PLATFORM;
        break;
      default:
        require("../../lib/errorReport").report(
          'not supported anchor type - (premium): ' + anchor_type,
          'adCreativeType');
        break;
    }
  } else {
   // for bass/non-premium type
   if (anchor_type == type.EXTERNAL_WEBPAGE) {
     default_type = AD_CREATIVE_TYPE.STANDARD;
     return;
   }
   anchor_type = parseInt(anchor_type, 10);

   switch (anchor_type) {
     case type.PAGE:
       default_type = bass ?
         AD_CREATIVE_TYPE.BASS_PAGE_CONNECTIONS :
         AD_CREATIVE_TYPE.INLINE_FAN;
       break;
     case type.GROUP:
     case type.REVIEW:
       default_type = AD_CREATIVE_TYPE.INLINE_FAN;
       break;
     case type.PLACE:
       default_type = AD_CREATIVE_TYPE.BASS_PAGE_CHECKINS;
       break;
     case type.EVENT:
       default_type = AD_CREATIVE_TYPE.INLINE_RSVP;
       break;
     case type.APP:
       default_type = bass ?
         AD_CREATIVE_TYPE.BASS_APP_CONNECTIONS :
         AD_CREATIVE_TYPE.PREMIUM_PLATFORM;
       break;
     default:
     require("../../lib/errorReport").report(
       'not supported anchor type: ' + anchor_type,
       'adCreativeType');
       break;
    }
  }

  return default_type;
}

exports.getDefaultCreativeTypeByAnchor = getDefaultCreativeTypeByAnchor;
exports.is_bass_type = is_bass_type;
exports.getCategoryByCreativeType = getCategoryByCreativeType;
exports.id2string = id2string;
exports.string2id = string2id;
exports.AD_CREATIVE_TYPE = AD_CREATIVE_TYPE;
exports.AD_CREATIVE_TYPE_MAP = AD_CREATIVE_TYPE_MAP;
exports.AD_CREATIVE_CATEGORY = AD_CREATIVE_CATEGORY;
