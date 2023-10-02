import { convertYouTubeUrl } from '../index';

const urls: string[] = [
  'https://www.youtube.com/watch?v=gqTixgeVs1c',
  'https://www.youtube.com/watch?v=gqTixgeVs1c&list=RDGMEMCMFH2exzjBeE_zAHHJOdxg',
  'https://www.youtube.com/watch?v=gqTixgeVs1c&list=RDGMEMCMFH2exzjBeE_zAHHJOdxg&index=1',
  'https://www.youtube.com/watch?v=UeaNVyB8AlM&list=RDGMEMR48zJN_YMORCOLhrAwXwKwVMUeaNVyB8AlM&start_radio=1',
  'https://m.youtube.com/watch?v=F0U7wwXCqdo',
  'https://m.youtube.com/watch?v=F0U7wwXCqdo&list=RDGMEMR48zJN_YMORCOLhrAwXwKwVMUeaNVyB8AlM',
  'https://m.youtube.com/watch?v=F0U7wwXCqdo&list=RDGMEMR48zJN_YMORCOLhrAwXwKwVMUeaNVyB8AlM&index=2',
  'https://m.youtube.com/watch?v=g1xqjio4YX4&list=RDGMEMfhzoLwQjqfpiXic5LqFvjQVMg1xqjio4YX4&start_radio=1',
  'https://m.youtube.com/watch?v=g1xqjio4YX4&list=RDGMEMfhzoLwQjqfpiXic5LqFvjQVMg1xqjio4YX4&index=1&pp=8AUB',
]

const expect_converted_urls: string[] = [
  'youtu.be/gqTixgeVs1c',
  'youtu.be/gqTixgeVs1c',
  'youtu.be/gqTixgeVs1c',
  'youtu.be/UeaNVyB8AlM',
  'youtu.be/F0U7wwXCqdo',
  'youtu.be/F0U7wwXCqdo',
  'youtu.be/F0U7wwXCqdo',
  'youtu.be/g1xqjio4YX4',
  'youtu.be/g1xqjio4YX4',
]

// urlsをconvertYouTubeUrlにかけた結果がexpect_converted_urlsと一致するかどうかを確認するJestのテスト
test('convertYouTubeUrl', () => {
  urls.map((url, index) => {
    expect(convertYouTubeUrl(url)).toBe(expect_converted_urls[index]);
  });
});
