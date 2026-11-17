import { TarotCardData } from "@/types/tarot";

export const MAJOR_ARCANA: TarotCardData[] = [
  {
    id: "major-00-fool",
    number: 0,
    arcana: "major",
    nameEn: "The Fool",
    nameVi: "Kẻ Khờ (The Fool)",
    uprightKeywords: ["Khởi đầu mới", "Sự ngây thơ", "Tự do", "Can đảm", "Tiềm năng vô hạn"],
    reversedKeywords: ["Liều lĩnh", "Ngây thơ thái quá", "Do dự", "Thiếu cẩn trọng", "Sợ hãi"],
    uprightMeaning: "The Fool đại diện cho bước nhảy vĩ đại vào hư không với niềm tin thuần khiết. Bạn đang đứng trước ngưỡng cửa của một chương mới đầy hứa hẹn, nơi những quy chuẩn cũ không còn bó buộc bạn. Hãy tin vào tiếng gọi của trực giác và dám dấn thân.",
    reversedMeaning: "Ở vị trí ngược, The Fool cảnh báo về sự bốc đồng, hành động thiếu suy xét hoặc ngược lại, nỗi sợ hãi tê liệt khiến bạn không dám bước tiếp. Cần nhìn rõ mép vực trước khi nhảy.",
    symbolism: "Chàng trai trẻ nhìn về bầu trời, chú chó trắng trung thành cảnh báo hiểm nguy, bông hồng trắng tượng trưng cho sự thuần khiết, gói tay nải chứa đựng tiềm năng chưa khai mở.",
    reflectionPrompt: "Nếu nỗi sợ thất bại hoàn toàn biến mất, bạn sẽ can đảm bắt đầu điều gì ngay hôm nay?",
    element: "air",
    astrologicalSign: "Uranus",
    accentColor: "#F4D03F",
    categoryMeanings: {
      upright: {
        love: "Một khởi đầu lãng mạn bất ngờ, tình yêu không định kiến, sự tươi mới ngập tràn.",
        career: "Dự án mới đầy táo bạo, cơ hội chuyển ngành hoặc khởi nghiệp với tinh thần tiên phong.",
        finance: "Sẵn sàng đón nhận cơ hội đầu tư mới nhưng cần giữ sự tỉnh táo cơ bản.",
        self: "Tự do nội tâm tuyệt đối, giải phóng bản thân khỏi những kỳ vọng của người khác."
      },
      reversed: {
        love: "Thiếu trách nhiệm, lời hứa suông hoặc sợ cam kết sâu sắc trong mối quan hệ.",
        career: "Quyết định nghỉ việc bốc đồng hoặc thiếu kế hoạch dự phòng cho tương lai.",
        finance: "Chi tiêu hoang phí cho những thú vui nhất thời, rủi ro tài chính không đáng có.",
        self: "Cảm giác lạc lối giữa tự do vô định, bất an trước tương lai chưa định hình."
      }
    }
  },
  {
    id: "major-01-magician",
    number: 1,
    arcana: "major",
    nameEn: "The Magician",
    nameVi: "Nhà Ảo Thuật (The Magician)",
    uprightKeywords: ["Hiện thực hóa", "Năng lực", "Ý chí", "Sự tập trung", "Sáng tạo"],
    reversedKeywords: ["Thao túng", "Lãng phí tài năng", "Ý đồ bất chính", "Thiếu định hướng"],
    uprightMeaning: "The Magician sở hữu mọi công cụ cần thiết trên chiếc bàn của mình: Đũa, Cốc, Kiếm và Xu. Bạn có đầy đủ nguồn lực, tài năng và ý chí để biến ý niệm thành hiện thực. Đây là thời khắc hành động dứt khoát.",
    reversedMeaning: "Lá bài cảnh báo tài năng đang bị sử dụng sai mục đích, sự thao túng tâm lý hoặc cảm giác bất lực do thiếu niềm tin vào năng lực thực sự của chính mình.",
    symbolism: "Biểu tượng vô cực trên đầu, một tay chỉ lên trời một tay chỉ xuống đất ('Như trên sao, dưới vậy'), bàn thờ bốn nguyên tố biểu trưng cho sự làm chủ thế giới vật chất và tinh thần.",
    reflectionPrompt: "Nguồn lực quý giá nhất mà bạn đang sở hữu nhưng chưa khai thác hết là gì?",
    element: "air",
    astrologicalSign: "Mercury",
    accentColor: "#E74C3C",
    categoryMeanings: {
      upright: {
        love: "Chủ động bày tỏ, sức hút cá nhân mạnh mẽ, khả năng xây dựng mối liên kết sâu sắc.",
        career: "Làm chủ dự án, thể hiện kỹ năng xuất sắc, biến thách thức thành bàn đạp thăng tiến.",
        finance: "Khả năng tạo ra nguồn thu nhập mới từ sự khéo léo và kỹ năng độc đáo.",
        self: "Tập trung tâm trí, hợp nhất ý chí và hành động để kiến tạo thực tại mong muốn."
      },
      reversed: {
        love: "Sự thiếu chân thành, dùng chiêu trò để kiểm soát đối phương hoặc ảo tưởng tình cảm.",
        career: "Kỹ năng bị bỏ phí, thiếu tập trung vào mục tiêu trọng tâm, nguy cơ lừa dối công việc.",
        finance: "Cẩn thận với những lời mời gọi đầu tư quá hứa hẹn hoặc cờ bạc mạo hiểm.",
        self: "Mất niềm tin vào tiềm năng của bản thân, năng lượng bị phân tán vô ích."
      }
    }
  },
  {
    id: "major-02-high-priestess",
    number: 2,
    arcana: "major",
    nameEn: "The High Priestess",
    nameVi: "Nữ Đại Tư Tế (The High Priestess)",
    uprightKeywords: ["Trực giác", "Bí ẩn", "Tiềm thức", "Trí tuệ tĩnh lặng", "Sự thấu suốt"],
    reversedKeywords: ["Bỏ qua trực giác", "Bí mật độc hại", "Bề nổi", "Mất kết nối nội tâm"],
    uprightMeaning: "The High Priestess ngồi giữa hai cột trụ đối lập của đền thờ, người nắm giữ cuộn kinh tri thức Tora. Câu trả lời bạn tìm kiếm không nằm ở những ồn ào bên ngoài, mà lắng đọng trong sự tĩnh lặng của trực giác.",
    reversedMeaning: "Bạn đang phớt lờ tiếng nói trực giác bên trong, quá phụ thuộc vào logic bề nổi hoặc để những bí mật chưa phơi bày gặm nhấm tâm hồn.",
    symbolism: "Hai cột Boaz và Jachin (Bóng tối và Ánh sáng), tấm màn trái lựu che giấu cõi thiêng, vầng trăng khuyết dưới chân tượng trưng cho sự kết nối với chu kỳ cảm xúc và tiềm thức.",
    reflectionPrompt: "Tiếng nói thầm thì trong tâm can đang cố gắng cảnh báo hay nhắc nhở bạn điều gì?",
    element: "water",
    astrologicalSign: "Moon",
    accentColor: "#3498DB",
    categoryMeanings: {
      upright: {
        love: "Sự thấu cảm không lời, tình cảm sâu sắc ẩn kín, sức hút thần bí khó cưỡng.",
        career: "Lắng nghe trực giác trong quyết định công việc, tìm hiểu kỹ tài liệu nội bộ trước khi hành động.",
        finance: "Giữ kín kế hoạch tài chính, không nên công khai các khoản đầu tư quan trọng.",
        self: "Nuôi dưỡng chiều sâu tâm hồn, thiền định, lắng nghe giấc mơ và điềm báo."
      },
      reversed: {
        love: "Khoảng cách cảm xúc, nghi kỵ vô cớ, che giấu sự thật gây tổn thương.",
        career: "Bỏ sót thông tin then chốt do vội vã, gặp phải người che giấu động cơ thực sự.",
        finance: "Thiếu minh bạch trong giao dịch, cẩn trọng với các điều khoản ngầm.",
        self: "Tâm trí xáo động, xa rời tiếng gọi nguyên bản của bản thể."
      }
    }
  },
  {
    id: "major-03-empress",
    number: 3,
    arcana: "major",
    nameEn: "The Empress",
    nameVi: "Nữ Hoàng (The Empress)",
    uprightKeywords: ["Màu mỡ", "Trù phú", "Nuôi dưỡng", "Tình mẫu tử", "Sáng tạo nghệ thuật"],
    reversedKeywords: ["Tắc nghẽn sáng tạo", "Nuông chiều thái quá", "Kiệt quệ", "Phụ thuộc"],
    uprightMeaning: "The Empress là hiện thân của Đất Mẹ và sự dồi dào vô tận của tự nhiên. Ý tưởng của bạn đang trong giai đoạn đâm chồi nảy lộc và sẽ sớm thu hoạch quả ngọt. Hãy chăm sóc bản thân và môi trường sống của bạn với tình yêu thương bao dung.",
    reversedMeaning: "Sự kiệt quệ do cho đi quá nhiều mà quên nuôi dưỡng chính mình, hoặc cảm giác khô cằn trong cảm xúc và năng lượng sáng tạo.",
    symbolism: "Vương miện 12 ngôi sao, cánh đồng lúa mì vàng óng, tấm đệm biểu tượng Sao Kim (Venus), dòng suối nguồn tuôn chảy đại diện cho sức sống tuôn trào.",
    reflectionPrompt: "Điều gì trong cuộc sống của bạn đang cần được chăm sóc dịu dàng và kiên nhẫn hơn?",
    element: "earth",
    astrologicalSign: "Venus",
    accentColor: "#2ECC71",
    categoryMeanings: {
      upright: {
        love: "Tình yêu ấm áp, sự chở che trọn vẹn, khả năng kết nối gia đình và đơm hoa kết trái.",
        career: "Môi trường làm việc nuôi dưỡng, các dự án sáng tạo phát triển rực rỡ.",
        finance: "Tài chính khởi sắc, sự sung túc và dòng tiền ổn định chảy về.",
        self: "Tận hưởng niềm vui giác quan, yêu thương cơ thể và kết nối với thiên nhiên."
      },
      reversed: {
        love: "Kiểm soát nhân danh tình yêu, ghen tuông ngột ngạt hoặc cảm giác bị bỏ rơi.",
        career: "Bế tắc ý tưởng, thiếu cảm hứng làm việc, bất hòa với cộng sự nữ.",
        finance: "Chi tiêu xa xỉ vượt khả năng, cảm giác lo âu về sự thiếu thốn ảo.",
        self: "Bỏ bê sức khỏe bản thân, cần hồi phục năng lượng và thiết lập ranh giới cảm xúc."
      }
    }
  },
  {
    id: "major-04-emperor",
    number: 4,
    arcana: "major",
    nameEn: "The Emperor",
    nameVi: "Hoàng Đế (The Emperor)",
    uprightKeywords: ["Kỷ luật", "Uy quyền", "Cấu trúc", "Sự ổn định", "Khả năng lãnh đạo"],
    reversedKeywords: ["Độc đoán", "Cứng nhắc", "Lạm quyền", "Mất kiểm soát", "Thiếu trật tự"],
    uprightMeaning: "The Emperor tượng trưng cho nguyên lý trật tự, kỷ luật thép và sự vững vàng. Để biến hoài bão thành hiện thực bền vững, bạn cần xây dựng nền móng có cấu trúc rõ ràng, nguyên tắc làm việc nghiêm cẩn và khả năng tự chủ cao độ.",
    reversedMeaning: "Lá bài ngược cảnh báo tính cách gia trưởng, kiểm soát vi mô làm ngột ngạt người khác, hoặc ngược lại là sự suy sụp trật tự và thiếu khả năng tự quản trị bản thân.",
    symbolism: "Ngai vàng đá chạm khắc đầu cừu (Bạch Dương), áo giáp sắt bên dưới áo choàng đỏ, vương trượng Ankh đại diện cho quyền năng duy trì sự sống và ổn định xã hội.",
    reflectionPrompt: "Khu vực nào trong cuộc sống của bạn đang cần nhiều kỷ luật và ranh giới rõ ràng hơn?",
    element: "fire",
    astrologicalSign: "Aries",
    accentColor: "#C0392B",
    categoryMeanings: {
      upright: {
        love: "Mối quan hệ an toàn, đáng tin cậy, cam kết lâu dài dựa trên sự tôn trọng lẫn nhau.",
        career: "Thăng tiến lên vị trí lãnh đạo, thiết lập quy trình chuẩn mực, đạt được sự công nhận uy tín.",
        finance: "Quản lý dòng tiền kỷ luật, đầu tư an toàn có chiến lược bảo toàn vốn.",
        self: "Rèn luyện ý chí, kiên định với nguyên tắc sống, làm chủ cảm xúc cá nhân."
      },
      reversed: {
        love: "Xung đột quyền lực, áp đặt ý chí lên bạn đời, bầu không khí khô khan thiếu lãng mạn.",
        career: "Mâu thuẫn với cấp trên độc đoán, quy trình quan liêu kìm hãm sự linh hoạt.",
        finance: "Quản lý tài chính hỗn loạn hoặc quá dè sẻn đến mức keo kiệt cực đoan.",
        self: "Phá bỏ những định kiến cứng nhắc, học cách linh hoạt thích ứng với biến động."
      }
    }
  },
  {
    id: "major-05-hierophant",
    number: 5,
    arcana: "major",
    nameEn: "The Hierophant",
    nameVi: "Giáo Hoàng (The Hierophant)",
    uprightKeywords: ["Truyền thống", "Hệ giá trị", "Người dẫn dắt", "Học hỏi", "Niềm tin"],
    reversedKeywords: ["Nổi loạn", "Cổ hủ", "Tín điều mù quáng", "Phá vỡ quy ước"],
    uprightMeaning: "The Hierophant đại diện cho trí tuệ truyền thừa, sự học hỏi từ những bậc thầy và việc gắn kết với những giá trị đạo đức cốt lõi. Đây là thời điểm thích hợp để tìm kiếm lời khuyên từ người có kinh nghiệm hoặc tuân thủ những chuẩn mực đã được kiểm chứng.",
    reversedMeaning: "Lá bài báo hiệu bạn đang cảm thấy gò bó bởi những định kiến giáo điều lỗi thời. Đã đến lúc đặt câu hỏi về những gì bạn được dạy và tự tìm kiếm chân lý cho riêng mình.",
    symbolism: "Ba tầng vương miện giáo hoàng, hai chiếc chìa khóa vàng chéo nhau mở cánh cửa tri thức, hai vị đệ tử đang lắng nghe lời khai sáng thiêng liêng.",
    reflectionPrompt: "Hệ giá trị cốt lõi nào đang dẫn dắt mọi quyết định quan trọng của bạn lúc này?",
    element: "earth",
    astrologicalSign: "Taurus",
    accentColor: "#9B59B6",
    categoryMeanings: {
      upright: {
        love: "Mối quan hệ cam kết truyền thống, hôn nhân, sự tương đồng sâu sắc về thế giới quan.",
        career: "Làm việc theo tổ chức chuyên nghiệp, tìm được người cố vấn (mentor) tận tâm chỉ dạy.",
        finance: "Chiến lược đầu tư truyền thống, an toàn, tuân thủ nghiêm ngặt quy định pháp lý.",
        self: "Học tập triết lý, tìm về cội nguồn tâm linh, củng cố la bàn đạo đức nội tâm."
      },
      reversed: {
        love: "Quan điểm sống bất đồng do áp lực từ truyền thống gia đình hoặc xã hội.",
        career: "Quy tắc công ty gò bó bức bối, mong muốn tách ra làm việc độc lập tự do.",
        finance: "Cẩn thận với những lời khuyên tài chính từ những tổ chức truyền thống không còn phù hợp.",
        self: "Can đảm bước ra khỏi vùng an toàn giáo điều để định hình bản ngã đích thực."
      }
    }
  },
  {
    id: "major-06-lovers",
    number: 6,
    arcana: "major",
    nameEn: "The Lovers",
    nameVi: "Những Kẻ Yêu Nhau (The Lovers)",
    uprightKeywords: ["Tình yêu", "Sự hòa hợp", "Lựa chọn đạo đức", "Hợp nhất", "Sự gắn kết"],
    reversedKeywords: ["Bất hòa", "Lựa chọn sai lầm", "Mất cân bằng", "Xung đột nội tâm"],
    uprightMeaning: "The Lovers không chỉ nói về sự rung động lãng mạn mà còn là bài học về sự lựa chọn mang tính bản lề. Hai tâm hồn hòa hợp khi họ chia sẻ cùng hệ giá trị. Bạn đang đứng trước ngã rẽ đòi hỏi phải sống thật với tiếng gọi con tim.",
    reversedMeaning: "Sự chia rẽ, bất hòa trong giao tiếp hoặc mâu thuẫn giữa lý trí và cảm xúc. Bạn có thể đang đưa ra lựa chọn làm hài lòng người khác nhưng phản bội chính mình.",
    symbolism: "Tổng lãnh thiên thần Raphael chúc phúc từ trên mây, cây sự sống và cây tri thức thiện ác, ngọn núi xa biểu tượng cho hành trình vươn tới sự giác ngộ.",
    reflectionPrompt: "Lựa chọn nào sẽ phản ánh chân thực nhất con người mà bạn mong muốn trở thành?",
    element: "air",
    astrologicalSign: "Gemini",
    accentColor: "#E91E63",
    categoryMeanings: {
      upright: {
        love: "Sự gắn kết tri kỷ, thấu cảm sâu sắc, tình yêu chân thành và thăng hoa đôi lứa.",
        career: "Hợp tác đối tác ăn ý, các thỏa thuận đôi bên cùng có lợi (win-win), lựa chọn ngã rẽ nghề nghiệp.",
        finance: "Cân đối giữa chi tiêu hưởng thụ và đầu tư tương lai, quyết định tài chính chung minh bạch.",
        self: "Hợp nhất các phần tính cách đối lập, chấp nhận và yêu thương toàn bộ bản thân."
      },
      reversed: {
        love: "Khoảng cách trong thấu hiểu, nghi ngờ giá trị của mối quan hệ, cám dỗ bên ngoài.",
        career: "Bất đồng đối tác kinh doanh, lựa chọn nghề nghiệp mâu thuẫn với lương tâm cá nhân.",
        finance: "Tranh chấp tài chính chung hoặc đưa ra quyết định mua sắm thiếu sự đồng thuận.",
        self: "Xung đột nội tâm dữ dội, cảm giác bị giằng xé giữa điều nên làm và điều muốn làm."
      }
    }
  },
  {
    id: "major-07-chariot",
    number: 7,
    arcana: "major",
    nameEn: "The Chariot",
    nameVi: "Cỗ Chiến Xa (The Chariot)",
    uprightKeywords: ["Ý chí sắt đá", "Chiến thắng", "Định hướng", "Vượt chướng ngại", "Kiểm soát"],
    reversedKeywords: ["Mất phương hướng", "Hung hăng", "Bất lực", "Thất bại do nóng vội"],
    uprightMeaning: "Chiến xa lao về phía trước nhờ sự điều khiển khéo léo của người chiến binh chế ngự hai nhân sư đen và trắng. Bằng ý chí kiên định và mục tiêu rõ ràng, bạn hoàn toàn có thể vượt qua mọi nghịch cảnh để chạm tay vào vinh quang.",
    reversedMeaning: "Lá bài ngược cảnh báo sự mất kiểm soát tay lái, hành động hung hăng hoặc cảm giác bất lực khi bị dòng đời xô đẩy mà không có mục tiêu rõ ràng.",
    symbolism: "Người chiến binh đội vương miện sao, áo giáp mang ký hiệu giả kim, hai nhân sư biểu trưng cho các lực lượng mâu thuẫn được quy tụ bằng sức mạnh ý chí thuần túy.",
    reflectionPrompt: "Mục tiêu nào đang đòi hỏi bạn phải dồn 100% năng lượng và sự tập trung cao độ nhất?",
    element: "water",
    astrologicalSign: "Cancer",
    accentColor: "#E67E22",
    categoryMeanings: {
      upright: {
        love: "Cùng nhau vượt qua sóng gió thử thách, bảo vệ mối quan hệ trước áp lực ngoại cảnh.",
        career: "Đột phá vượt bậc, đánh bại sự cạnh tranh, hoàn thành mục tiêu công việc khó khăn.",
        finance: "Chủ động kiểm soát tài chính, nỗ lực làm việc mang lại thành quả kinh tế xứng đáng.",
        self: "Làm chủ các xung động bản năng, rèn luyện tính tự giác và kiên trì không lay chuyển."
      },
      reversed: {
        love: "Áp đặt quan điểm một cách thô bạo, tranh cãi gay gắt dẫn đến kiệt quệ cảm xúc.",
        career: "Mất đà tiến lên, dự án trật bánh do nóng vội đốt cháy giai đoạn.",
        finance: "Mất kiểm soát ngân sách, đầu tư mạo hiểm không tính toán dẫn đến thua lỗ.",
        self: "Cảm giác bất lực khi mọi thứ tuột khỏi tầm tay, cần dừng lại định hình lại lộ trình."
      }
    }
  },
  {
    id: "major-08-strength",
    number: 8,
    arcana: "major",
    nameEn: "Strength",
    nameVi: "Sức Mạnh Nhu Thuận (Strength)",
    uprightKeywords: ["Dịu dàng", "Lòng dũng cảm", "Kiên nhẫn", "Chế ngự bản năng", "Bao dung"],
    reversedKeywords: ["Tự ti", "Mất bình tĩnh", "Thô bạo", "Sợ hãi", "Kiệt sức"],
    uprightMeaning: "Người phụ nữ dịu dàng khép miệng sư tử dữ không phải bằng xích sắt mà bằng tình thương và sự thấu hiểu. Sức mạnh thực sự không nằm ở sự thị uy hung bạo, mà ở sự nhẫn nại, lòng trắc ẩn và khả năng tự chủ phi thường.",
    reversedMeaning: "Cảm giác tự ti, nghi ngờ sức mạnh của bản thân hoặc để cơn giận dữ và bản năng động vật chi phối hành vi khiến mọi việc trở nên tồi tệ hơn.",
    symbolism: "Biểu tượng vô cực trên đầu người phụ nữ, sư tử hung dữ thuần phục dưới bàn tay mềm mại, vòng hoa biểu thị vẻ đẹp của sự thanh tao.",
    reflectionPrompt: "Tình huống nào lúc này cần bạn đối đãi bằng sự dịu dàng thay vì đối đầu gay gắt?",
    element: "fire",
    astrologicalSign: "Leo",
    accentColor: "#F39C12",
    categoryMeanings: {
      upright: {
        love: "Tình cảm bao dung, kiên nhẫn cảm hóa những góc khuất gai góc của đối phương.",
        career: "Khéo léo xử lý mâu thuẫn ngoại giao, duy trì phong độ bền bỉ trong áp lực lớn.",
        finance: "Kiểm soát ham muốn tiêu xài bốc đồng, giữ vững kỷ luật tài chính dài hạn.",
        self: "Hòa giải với phần bóng tối bên trong, chuyển hóa nỗi sợ hãi thành nội lực vững chãi."
      },
      reversed: {
        love: "Bùng phát cơn giận, thiếu kiên nhẫn dẫn đến rạn nứt, để sự tự ti cản trở hạnh phúc.",
        career: "Đầu hàng trước khó khăn, thiếu tự tin khi trình bày ý tưởng trước tập thể.",
        finance: "Lo lắng thái quá về tiền bạc dẫn đến những phản ứng thái quá thiếu hiệu quả.",
        self: "Cần phục hồi năng lượng tinh thần, tránh tự dằn vặt hay phê phán bản thân quá mức."
      }
    }
  },
  {
    id: "major-09-hermit",
    number: 9,
    arcana: "major",
    nameEn: "The Hermit",
    nameVi: "Ẩn Sĩ (The Hermit)",
    uprightKeywords: ["Soi chiếu nội tâm", "Tìm kiếm chân lý", "Tĩnh lặng", "Minh triết", "Cô độc tích cực"],
    reversedKeywords: ["Cô lập tiêu cực", "Lạc lối", "Bướng bỉnh", "Xa lánh xã hội"],
    uprightMeaning: "Vị ẩn sĩ đứng trên đỉnh núi tuyết cầm chiếc đèn lồng chứa ngôi sao 6 cánh soi đường cho những ai tìm kiếm sự thông tuệ. Đây là thời gian rút lui khỏi những ồn ào trần thế để lắng nghe tiếng nói sâu thẳm trong linh hồn.",
    reversedMeaning: "Sự cô độc biến thành nỗi cô lập cay đắng, khép kín trái tim hoặc từ chối sự giúp đỡ quý báu từ những người xung quanh.",
    symbolism: "Ngọn đèn lồng Chân Lý soi sáng từng bước đi, cây gậy của bậc hiền triết làm điểm tựa vững chãi trên đỉnh núi tuyết cao vợi.",
    reflectionPrompt: "Điều gì bạn chỉ có thể nhận ra khi ở một mình trong không gian tĩnh lặng tuyệt đối?",
    element: "earth",
    astrologicalSign: "Virgo",
    accentColor: "#7F8C8D",
    categoryMeanings: {
      upright: {
        love: "Khoảng lặng cần thiết để nhìn nhận lại bản thân, hiểu rõ điều mình thực sự khao khát trong tình yêu.",
        career: "Nghiên cứu chuyên sâu, tự đánh giá lộ trình sự nghiệp, nâng cao chuyên môn độc lập.",
        finance: "Xem xét kỹ lưỡng ngân sách, sống tối giản, cắt giảm những chi phí phù phiếm.",
        self: "Tự soi rọi nội tâm, tu tập tâm linh, tìm thấy bình an tự tại trong sự cô đơn tích cực."
      },
      reversed: {
        love: "Tự dựng tường ngăn cách, từ chối giao tiếp khiến đối phương cảm thấy xa lạ.",
        career: "Tự cô lập với đồng đội, từ chối hợp tác dẫn đến hiệu suất trì trệ.",
        finance: "Quá dè dặt sợ hãi đến mức bỏ lỡ những cơ hội phát triển hợp lý.",
        self: "Rơi vào trầm mặc tiêu cực, cần bước ra ngoài hít thở khí trời và kết nối lại với cuộc sống."
      }
    }
  },
  {
    id: "major-10-wheel-of-fortune",
    number: 10,
    arcana: "major",
    nameEn: "Wheel of Fortune",
    nameVi: "Bánh Xe Số Phận (Wheel of Fortune)",
    uprightKeywords: ["Chuyển biến", "Định mệnh", "Cơ hội mới", "Chu kỳ cuộc đời", "May mắn"],
    reversedKeywords: ["Vận rủi tạm thời", "Kháng cự thay đổi", "Chu kỳ tiêu cực lặp lại"],
    uprightMeaning: "Bánh xe thời gian không ngừng quay. Khi đứng ở đáy sâu, hướng đi duy nhất là đi lên. Cuộc sống đang mở ra một bước ngoặt quan trọng mang tính định mệnh. Hãy linh hoạt nắm bắt thời cơ khi vận may mỉm cười.",
    reversedMeaning: "Những biến cố ngoài dự tính xảy đến khiến bạn chao đảo. Nhớ rằng đây chỉ là giai đoạn tạm thời của vòng quay; đừng cố níu kéo những gì đã qua.",
    symbolism: "Bốn sinh vật thiêng liêng ở bốn góc (Thiên thần, Đại bàng, Sư tử, Bò), chữ TORA / ROTA trên bánh xe, nhân sư cầm kiếm đại diện cho sự cân bằng của vũ trụ.",
    reflectionPrompt: "Bạn đang sẵn sàng buông bỏ điều cũ nào để đón nhận bước ngoặt mới của số phận?",
    element: "fire",
    astrologicalSign: "Jupiter",
    accentColor: "#F1C40F",
    categoryMeanings: {
      upright: {
        love: "Gặp gỡ định mệnh, mối quan hệ bước sang trang mới tươi sáng, vận đào hoa nở rộ.",
        career: "Cơ hội thăng tiến bất ngờ, dự án gặp thời thuận lợi phát triển vượt bậc.",
        finance: "Tài lộc bất ngờ gõ cửa, vận may trong đầu tư hoặc giải quyết được bế tắc tài chính.",
        self: "Nhận thức sâu sắc về quy luật nhân quả và dòng chảy tự nhiên của cuộc đời."
      },
      reversed: {
        love: "Biến cố thử thách tình cảm, cảm giác mối quan hệ đang tụt dốc ngoài ý muốn.",
        career: "Kế hoạch bị đình trệ do yếu tố khách quan, cần kiên nhẫn chờ thời điểm thích hợp.",
        finance: "Thất thoát tài chính bất ngờ, cần có quỹ dự phòng khẩn cấp an toàn.",
        self: "Học cách chấp nhận vô thường, không để biến cố bên ngoài làm lung lay bình an nội tâm."
      }
    }
  },
  {
    id: "major-11-justice",
    number: 11,
    arcana: "major",
    nameEn: "Justice",
    nameVi: "Công Lý (Justice)",
    uprightKeywords: ["Công bằng", "Chân lý", "Trách nhiệm", "Nhân quả", "Quyết định sáng suốt"],
    reversedKeywords: ["Bất công", "Thiên vị", "Trốn tránh trách nhiệm", "Phán xét sai lầm"],
    uprightMeaning: "Nữ thần Công Lý ngồi trên ngai vàng với thanh gươm hai lưỡi và chiếc cân thăng bằng. Mọi hành động trong quá khứ giờ đây sẽ mang lại kết quả tương xứng. Hãy đối diện với sự thật bằng tâm trí sáng suốt và tinh thần trách nhiệm.",
    reversedMeaning: "Cảm giác bị đối xử bất công, định kiến cá nhân che mờ sự thật hoặc trốn tránh nhận lỗi trước hậu quả do chính mình gây ra.",
    symbolism: "Thanh gươm dựng đứng biểu thị lý trí sắc bén, chiếc cân cân bằng mọi nghiệp quả, bức màn tím tượng trưng cho lòng trắc ẩn hòa quyện cùng công lý.",
    reflectionPrompt: "Hành động nào của bạn đang cần sự trung thực và sòng phẳng tuyệt đối với chính mình?",
    element: "air",
    astrologicalSign: "Libra",
    accentColor: "#1ABC9C",
    categoryMeanings: {
      upright: {
        love: "Mối quan hệ bình đẳng, tôn trọng lẫn nhau, giải quyết khúc mắc bằng sự thành thật.",
        career: "Hợp đồng minh bạch, công sức được đền đáp xứng đáng, thắng lợi trong tranh chấp pháp lý.",
        finance: "Cân đối thu chi sòng phẳng, thanh toán nợ nần rõ ràng, đầu tư hợp pháp.",
        self: "Chịu trách nhiệm hoàn toàn cho cuộc đời mình, không đổ lỗi cho hoàn cảnh."
      },
      reversed: {
        love: "Sự bất bình đẳng trong mối quan hệ, một bên cho đi quá nhiều bên kia chỉ nhận.",
        career: "Bị đối xử thiếu công bằng tại nơi làm việc, rắc rối liên quan đến hợp đồng mập mờ.",
        finance: "Tranh chấp tài sản, cẩn trọng với các thủ tục giấy tờ có nguy cơ kiện tụng.",
        self: "Tự dối lòng hoặc phán xét người khác quá khắt khe, cần nhìn lại sự khách quan của mình."
      }
    }
  },
  {
    id: "major-12-hanged-man",
    number: 12,
    arcana: "major",
    nameEn: "The Hanged Man",
    nameVi: "Người Treo Ngược (The Hanged Man)",
    uprightKeywords: ["Buông bỏ", "Góc nhìn mới", "Tạm dừng", "Hy sinh có ý nghĩa", "Chấp nhận"],
    reversedKeywords: ["Bế tắc vô ích", "Cố chấp", "Hy sinh mù quáng", "Kháng cự thực tế"],
    uprightMeaning: "Người đàn ông bị treo ngược chân trên cành cây sự sống nhưng gương mặt toát lên vẻ thanh thản kỳ lạ với vầng hào quang quanh đầu. Đôi khi, cách duy nhất để tiến bộ là dừng lại, đảo ngược góc nhìn và học cách buông bỏ sự kiểm soát.",
    reversedMeaning: "Bạn đang trì hoãn hành động một cách vô ích, chịu đựng sự hy sinh không cần thiết hoặc ngoan cố bám giữ một quan điểm cũ kỹ đã hết thời.",
    symbolism: "Chân bắt chéo tạo hình số 4, hai tay chắp sau lưng tạo tam giác, vầng hào quang rạng rỡ của sự khai sáng tâm thức qua trải nghiệm tĩnh lặng.",
    reflectionPrompt: "Điều gì bạn cần buông tay để tìm lại sự bình yên và nhìn ra lối thoát mới?",
    element: "water",
    astrologicalSign: "Neptune",
    accentColor: "#16A085",
    categoryMeanings: {
      upright: {
        love: "Lùi lại một bước để thấu hiểu người kia, chấp nhận hy sinh cái tôi vì tương lai chung.",
        career: "Giai đoạn tạm hoãn để ấp ủ chiến lược mới, nhìn nhận lại phương thức làm việc từ góc độ khác.",
        finance: "Tạm thời đóng băng các kế hoạch lớn, kiên nhẫn chờ thời cơ chín muồi.",
        self: "Chuyển hóa nhận thức sâu sắc, giải phóng chấp niệm và kỳ vọng áp đặt."
      },
      reversed: {
        love: "Mắc kẹt trong mối quan hệ độc hại vì thói quen hy sinh mù quáng không được trân trọng.",
        career: "Trì trệ kéo dài do do dự không dám quyết định, phí hoài thời gian quý báu.",
        finance: "Mất tiền do không chịu cắt lỗ kịp thời khi thị trường đã đổi chiều.",
        self: "Cảm giác làm nạn nhân của hoàn cảnh, cần tự đứng dậy và hành động dứt khoát."
      }
    }
  },
  {
    id: "major-13-death",
    number: 13,
    arcana: "major",
    nameEn: "Death",
    nameVi: "Cái Chết & Tái Sinh (Death)",
    uprightKeywords: ["Kết thúc tất yếu", "Chuyển hóa sâu sắc", "Tái sinh", "Khép lại chu kỳ cũ"],
    reversedKeywords: ["Sợ thay đổi", "Níu kéo quá khứ", "Kéo dài nỗi đau", "Trì hoãn tái sinh"],
    uprightMeaning: "Lá bài Death hiếm khi mang ý nghĩa cái chết thể xác; nó là biểu tượng tối thượng của sự tái sinh và chuyển hóa. Điều gì không còn phục vụ cho sự phát triển của bạn phải khép lại để nhường chỗ cho mầm sống mới vươn lên.",
    reversedMeaning: "Bạn đang cố chấp níu kéo một quá khứ đã lụi tàn, sợ hãi bước vào bóng tối của sự thay đổi, vô tình khiến nỗi đau kéo dài dai dẳng.",
    symbolism: "Kỵ sĩ xương trắng cưỡi ngựa mang cờ hoa hồng thần bí, bình minh ló rạng phía sau hai ngọn tháp, mọi tầng lớp từ vua chúa đến trẻ nhỏ đều bình đẳng trước sự đổi thay.",
    reflectionPrompt: "Điều gì trong quá khứ của bạn đã thực sự kết thúc và đang chờ bạn chính thức nói lời từ biệt?",
    element: "water",
    astrologicalSign: "Scorpio",
    accentColor: "#2C3E50",
    categoryMeanings: {
      upright: {
        love: "Một chương tình cảm cũ khép lại dứt khoát, giải phóng để sẵn sàng cho tình yêu mới trọn vẹn hơn.",
        career: "Chuyển đổi nghề nghiệp triệt để, kết thúc hợp đồng cũ để mở ra chân trời mới.",
        finance: "Tái cấu trúc toàn diện tài chính, dũng cảm xóa bỏ các khoản đầu tư không hiệu quả.",
        self: "Lột xác tinh thần, từ bỏ bản ngã cũ để tái sinh thành phiên bản tự do, mạnh mẽ hơn."
      },
      reversed: {
        love: "Không thể buông bỏ người cũ, mắc kẹt trong những tổn thương quá khứ chưa lành.",
        career: "Ở lại công việc độc hại chỉ vì sợ thất nghiệp, sợ hãi sự bấp bênh của thay đổi.",
        finance: "Né tránh đối diện với khủng hoảng tài chính khiến tình hình thêm trầm trọng.",
        self: "Kháng cự quá trình trưởng thành tự nhiên, nỗi sợ vô hình trói buộc bước chân."
      }
    }
  },
  {
    id: "major-14-temperance",
    number: 14,
    arcana: "major",
    nameEn: "Temperance",
    nameVi: "Tiết Độ & Hòa Hợp (Temperance)",
    uprightKeywords: ["Cân bằng", "Hòa hợp", "Kiên nhẫn", "Điều hòa", "Giả kim thuật nội tâm"],
    reversedKeywords: ["Mất cân bằng", "Cực đoan", "Bất hòa", "Nóng nảy", "Thái quá"],
    uprightMeaning: "Thiên thần rót dòng nước thần qua lại giữa hai chiếc cốc mà không làm rơi một giọt. Đây là bài học về nghệ thuật dung hòa: kết hợp những yếu tố đối lập để tạo nên sự cân bằng hoàn hảo và vẻ đẹp thanh tịnh.",
    reversedMeaning: "Cuộc sống đang bị mất cân bằng trầm trọng do sự thái quá: làm việc kiệt sức, ăn uống vô độ hoặc phản ứng cực đoan làm tổn thương các mối quan hệ.",
    symbolism: "Thiên thần một chân đặt dưới nước một chân trên bờ, con đường dẫn tới vương miện ánh sáng trên đỉnh núi, sự chuyển dịch dòng năng lượng nhịp nhàng giữa hai cốc vàng.",
    reflectionPrompt: "Khu vực nào trong cuộc sống đang bị đẩy đến mức cực đoan và cần bạn tìm lại điểm cân bằng?",
    element: "fire",
    astrologicalSign: "Sagittarius",
    accentColor: "#48C9B0",
    categoryMeanings: {
      upright: {
        love: "Tình cảm hài hòa êm dịu, kiên nhẫn lắng nghe, cùng nhau dung hòa những khác biệt tính cách.",
        career: "Phối hợp nhịp nhàng trong tập thể, giải quyết xung đột bằng thái độ ôn hòa và thấu đáo.",
        finance: "Thu chi điều độ, chi tiêu chừng mực, tài chính duy trì trạng thái ổn định lâu dài.",
        self: "Tìm thấy sự tĩnh tại trong tâm hồn, chữa lành những vết thương cảm xúc."
      },
      reversed: {
        love: "Xung đột do thiếu nhẫn nại, đòi hỏi quá mức hoặc không chịu nhượng bộ lẫn nhau.",
        career: "Môi trường làm việc căng thẳng, mất nhịp độ công việc do quá tải và thiếu tổ chức.",
        finance: "Chi tiêu thất thường theo cảm xúc, mất kiểm soát ngân sách cá nhân.",
        self: "Cảm giác bức bối, tinh thần bất an, cần thanh lọc cơ thể và tâm trí."
      }
    }
  },
  {
    id: "major-15-devil",
    number: 15,
    arcana: "major",
    nameEn: "The Devil",
    nameVi: "Ác Quỷ (The Devil)",
    uprightKeywords: ["Ràng buộc", "Nghiện ngập", "Cám dỗ vật chất", "Ảo tưởng", "Xiềng xích vô hình"],
    reversedKeywords: ["Giải thoát", "Nhận thức tỉnh táo", "Phá bỏ xiềng xích", "Lấy lại quyền năng"],
    uprightMeaning: "Hai con người đứng bị xích vào bệ đá của quỷ dữ, nhưng sợi xích trên cổ họ thực chất rất lỏng lẻo. Lá bài phơi bày những nỗi sợ hãi, dục vọng tăm tối hoặc niềm tin giới hạn mà bạn đang tự nguyện để chúng trói buộc mình.",
    reversedMeaning: "Thời khắc tỉnh ngộ đã điểm. Bạn bắt đầu nhận ra bản chất của những ràng buộc độc hại và tìm thấy dũng khí để tháo bỏ chiếc xích, lấy lại quyền tự quyết cho cuộc đời mình.",
    symbolism: "Bàn tay giơ lên với cử chỉ đảo ngược, ngọn đuốc chúc xuống đất đốt cháy đam mê mù quáng, sợi xích lỏng lẻo biểu thị sự giam cầm xuất phát từ chính tâm trí.",
    reflectionPrompt: "Thói quen, nỗi sợ hay mối quan hệ độc hại nào đang giam cầm sự tự do đích thực của bạn?",
    element: "earth",
    astrologicalSign: "Capricorn",
    accentColor: "#8E44AD",
    categoryMeanings: {
      upright: {
        love: "Mối quan hệ ám ảnh, phụ thuộc cảm xúc cực độ, ghen tuông kiểm soát hoặc lạm dụng.",
        career: "Mắc kẹt trong công việc vì tiền lương dù căm ghét môi trường, áp lực vật chất đè nặng.",
        finance: "Nợ nần chồng chất, cờ bạc hoặc chi tiêu mất kiểm soát vì thỏa mãn thú vui ngắn hạn.",
        self: "Bị chi phối bởi các thói quen xấu, tự lừa dối bản thân rằng mình không có lựa chọn khác."
      },
      reversed: {
        love: "Dũng cảm chấm dứt mối quan hệ độc hại, chữa lành vết thương lệ thuộc tình cảm.",
        career: "Tìm ra lối thoát khỏi môi trường làm việc bóc lột, lấy lại quyền tự chủ nghề nghiệp.",
        finance: "Lên kế hoạch trả nợ nghiêm túc, cắt đứt các cám dỗ chi tiêu phù phiếm.",
        self: "Thức tỉnh tâm linh, vượt qua bóng tối tâm lý để bước ra ánh sáng tự do."
      }
    }
  },
  {
    id: "major-16-tower",
    number: 16,
    arcana: "major",
    nameEn: "The Tower",
    nameVi: "Tòa Tháp Đổ (The Tower)",
    uprightKeywords: ["Sụp đổ đột ngột", "Khai sáng chấn động", "Sự thật phơi bày", "Giải phóng đau đớn"],
    reversedKeywords: ["Né tránh khủng hoảng", "Kéo dài sự sụp đổ", "Sợ hãi biến cố"],
    uprightMeaning: "Tia sét vũ trụ đánh trúng đỉnh tháp ngạo mạn, làm đổ vương miện giả tạo và phá tan cấu trúc xây trên nền móng mục ruỗng. Dù gây sốc và đau đớn, sự sụp đổ này là cần thiết để giải phóng bạn khỏi những ảo tưởng sai lầm.",
    reversedMeaning: "Bạn đang cố gắng chống đỡ một công trình sắp sập hoặc né tránh đối diện với một sự thật đau lòng. Càng trì hoãn, cú va chạm cuối cùng sẽ càng dữ dội.",
    symbolism: "Tia sét của Thượng Đế đánh sập tháp đá kiêu ngạo, 22 giọt lửa vàng tượng trưng cho các bài học số phận, hai hình người rơi tự do khỏi vùng ảo tưởng.",
    reflectionPrompt: "Nền tảng ảo tưởng nào trong cuộc đời bạn cần phải sụp đổ để một sự thật vững chắc hơn ra đời?",
    element: "fire",
    astrologicalSign: "Mars",
    accentColor: "#D35400",
    categoryMeanings: {
      upright: {
        love: "Một sự thật gây sốc bị vỡ lở, tan vỡ đột ngột giải phóng bạn khỏi mối quan hệ giả tạo.",
        career: "Mất việc bất ngờ, khủng hoảng dự án hoặc sự sụp đổ của một tổ chức đòi hỏi tái định hình tức thì.",
        finance: "Tổn thất tài chính đột ngột đòi hỏi phải thay đổi toàn bộ lối sống và tư duy quản lý tiền bạc.",
        self: "Cú sốc tâm lý phá vỡ cái tôi kiêu ngạo, mở đường cho sự thức tỉnh sâu sắc nhất."
      },
      reversed: {
        love: "Cố chấp duy trì mối quan hệ đã rạn nứt tận gốc rễ, sống trong lo âu chờ ngày bùng nổ.",
        career: "Bám víu lấy công việc bấp bênh, né tránh những cảnh báo rõ ràng từ thực tế.",
        finance: "Chữa cháy tạm bợ bằng những giải pháp vay mượn ngắn hạn khiến khủng hoảng âm ỉ.",
        self: "Nỗi sợ hãi thay đổi làm tê liệt hành động, cần can đảm chấp nhận buông bỏ tàn tích cũ."
      }
    }
  },
  {
    id: "major-17-star",
    number: 17,
    arcana: "major",
    nameEn: "The Star",
    nameVi: "Ngôi Sao Hy Vọng (The Star)",
    uprightKeywords: ["Hy vọng", "Chữa lành", "Niềm tin", "Cảm hứng", "Thanh thản"],
    reversedKeywords: ["Mất niềm tin", "Tuyệt vọng", "Bi quan", "Bất an", "Tự hoài nghi"],
    uprightMeaning: "Sau cơn bão của Tòa Tháp, Ngôi Sao tỏa sáng trên bầu trời đêm yên bình. Cô gái trút dòng nước tưới tắm cho đất mẹ và nguồn suối với lòng tin thuần khiết. Đây là thời kỳ của sự chữa lành, niềm tin được tái sinh và tương lai ngập tràn ánh sáng.",
    reversedMeaning: "Mây đen che khuất ánh sao; bạn cảm thấy bi quan, mất phương hướng và nghi ngờ vào những điều tốt đẹp. Hãy nhớ rằng những vì sao vẫn luôn ở đó, chỉ chờ lòng bạn đủ tĩnh lặng để nhìn thấy.",
    symbolism: "Ngôi sao lớn 8 cánh cùng 7 vì sao nhỏ, cô gái khỏa thân tượng trưng cho sự chân thật thuần khiết, chú chim ibis trên cây tượng trưng cho trí tuệ thần thánh.",
    reflectionPrompt: "Ước mơ chân thành và thuần khiết nhất nào đang thôi thúc trái tim bạn tiếp tục hy vọng?",
    element: "air",
    astrologicalSign: "Aquarius",
    accentColor: "#5DADE2",
    categoryMeanings: {
      upright: {
        love: "Tình yêu trong sáng, sự kết nối tâm hồn sâu sắc, chữa lành những tổn thương cũ cùng nhau.",
        career: "Tìm thấy lý tưởng và sứ mệnh nghề nghiệp, cảm hứng dạt dào, cơ hội tỏa sáng tài năng.",
        finance: "Hy vọng tài chính tươi sáng, dòng tiền phục hồi tích cực sau giai đoạn khó khăn.",
        self: "Tâm hồn thanh thản, phục hồi năng lượng sống, kết nối lại với vũ trụ bao la."
      },
      reversed: {
        love: "Mất niềm tin vào tình yêu, hoài nghi lòng chân thành của người khác vì vết thương xưa.",
        career: "Thiếu cảm hứng, cảm thấy công việc vô nghĩa, tự ti về năng lực cá nhân.",
        finance: "Lo lắng bi quan thái quá về tương lai tài chính, không dám đầu tư cho bản thân.",
        self: "Cần tìm kiếm sự nâng đỡ tinh thần, nuôi dưỡng lại lòng tin từ những điều giản dị mỗi ngày."
      }
    }
  },
  {
    id: "major-18-moon",
    number: 18,
    arcana: "major",
    nameEn: "The Moon",
    nameVi: "Mặt Trăng Huyền Bí (The Moon)",
    uprightKeywords: ["Ảo ảnh", "Tiềm thức", "Nỗi sợ vô hình", "Trực giác", "Sương mù mờ ảo"],
    reversedKeywords: ["Sương tan", "Đối diện sự thật", "Vượt qua nỗi sợ", "Sáng tỏ"],
    uprightMeaning: "Ánh trăng soi rọi một vùng đất huyền bí nơi chó sói và chó nhà cùng sủa lên trời, và con tôm trồi lên từ vực nước sâu thẳm. Bạn đang đi qua vùng sương mù của ảo giác và nỗi sợ vô căn cứ. Đừng vội đưa ra kết luận lớn khi mọi thứ chưa sáng tỏ.",
    reversedMeaning: "Màn sương bắt đầu tan biến. Những bí mật đen tối dần lộ diện và bạn bắt đầu phân biệt được đâu là ảo ảnh do nỗi sợ phóng đại, đâu là sự thật khách quan.",
    symbolism: "Mặt trăng khóc những giọt sương vàng, hai con chó đại diện cho phần hoang dã và thuần hóa của tâm trí, con tôm từ vực sâu biểu thị những nỗi sợ tiềm thức trỗi dậy.",
    reflectionPrompt: "Nỗi sợ vô hình nào đang bóp méo nhận thức của bạn về hiện thực xung quanh?",
    element: "water",
    astrologicalSign: "Pisces",
    accentColor: "#566573",
    categoryMeanings: {
      upright: {
        love: "Mối quan hệ mập mờ, thiếu trung thực hoặc sự bất an vô cớ làm lung lay lòng tin.",
        career: "Thông tin mập mờ, nguy cơ bị lừa dối sau lưng, không nên ký kết hợp đồng vội vã.",
        finance: "Nguy cơ tiềm ẩn trong các dự án đầu tư thiếu minh bạch, cẩn trọng với các cam kết miệng.",
        self: "Khám phá thế giới giấc mơ và vô thức, giải tỏa những lo âu bị đè nén từ thời thơ ấu."
      },
      reversed: {
        love: "Sự thật được phơi bày, giải tỏa những hiểu lầm tích tụ lâu ngày, lòng tin dần phục hồi.",
        career: "Thấy rõ âm mưu hoặc sai sót ngầm, định hình lại đường hướng công việc chuẩn xác.",
        finance: "Phát hiện kịp thời các khoản thất thoát hoặc gian lận tài chính.",
        self: "Dũng cảm bước qua bóng tối tâm lý, không còn bị chi phối bởi các cơn hoảng loạn vô cớ."
      }
    }
  },
  {
    id: "major-19-sun",
    number: 19,
    arcana: "major",
    nameEn: "The Sun",
    nameVi: "Mặt Trời Rực Rỡ (The Sun)",
    uprightKeywords: ["Hân hoan", "Thành công", "Rõ ràng", "Sức sống", "Sự thật thuần khiết"],
    reversedKeywords: ["Mây che mờ", "Lạc quan tếu", "Chậm trễ niềm vui", "Kiêu ngạo"],
    uprightMeaning: "Mặt Trời tỏa rạng hào quang mang đến sự sống, hơi ấm và niềm hân hoan tột cùng. Đứa trẻ cưỡi ngựa trắng tự do dưới ánh mặt trời rực rỡ tượng trưng cho sự thuần khiết, thành công rực rỡ và mọi bóng tối đều bị xua tan.",
    reversedMeaning: "Niềm vui bị trì hoãn đôi chút bởi những đám mây u ám tạm thời, hoặc sự tự mãn thái quá khiến bạn chủ quan trước những chi tiết nhỏ.",
    symbolism: "Mặt trời với khuôn mặt hiền từ phóng ra những tia sáng thẳng và lượn sóng, đứa trẻ trần trụi đội vòng hoa hướng dương, lá cờ đỏ tung bay tượng trưng cho sự sống bất diệt.",
    reflectionPrompt: "Điều gì mang lại cho bạn niềm vui hồn nhiên, thuần khiết và năng lượng sống tích cực nhất?",
    element: "fire",
    astrologicalSign: "Sun",
    accentColor: "#F39C12",
    categoryMeanings: {
      upright: {
        love: "Tình yêu rạng rỡ, hạnh phúc ngập tràn, sự đồng điệu trọn vẹn và tương lai sáng lạn.",
        career: "Thành công vang dội, đạt được mục tiêu xuất sắc, nhận được sự tán thưởng nồng nhiệt.",
        finance: "Tài chính thịnh vượng, lợi nhuận tăng trưởng mạnh mẽ, sự hanh thông về tiền bạc.",
        self: "Tràn đầy sinh lực, tự tin tỏa sáng đúng với bản chất tốt đẹp của chính mình."
      },
      reversed: {
        love: "Có đôi chút hiểu lầm nhỏ nhưng không đáng lo ngại, chỉ cần thêm thời gian để mở lòng.",
        career: "Thành công đến chậm hơn dự kiến, cần kiên nhẫn và tránh thái độ kiêu ngạo tự phụ.",
        finance: "Tài chính ổn định nhưng cần đề phòng chi tiêu quá tay trong lúc phấn khích.",
        self: "Tìm lại niềm vui bên trong khi hoàn cảnh bên ngoài chưa thực sự như ý."
      }
    }
  },
  {
    id: "major-20-judgement",
    number: 20,
    arcana: "major",
    nameEn: "Judgement",
    nameVi: "Phán Xét & Thức Tỉnh (Judgement)",
    uprightKeywords: ["Thức tỉnh", "Tiếng gọi định mệnh", "Tha thứ", "Tái sinh", "Phán đoán đúng đắn"],
    reversedKeywords: ["Tự phán xét khắt khe", "Trốn tránh tiếng gọi", "Hối tiếc", "Nghi ngờ"],
    uprightMeaning: "Thiên thần Gabriel thổi chiếc tù và thiêng liêng đánh thức những linh hồn trỗi dậy từ lòng mộ. Bạn đang đứng trước thời khắc thức tỉnh vĩ đại: nhận ra tiếng gọi sứ mệnh của cuộc đời, tha thứ cho quá khứ và bước vào một tầng tâm thức mới.",
    reversedMeaning: "Bạn đang chần chừ không dám đáp lại tiếng gọi của lương tâm, tự dằn vặt bản thân bằng những lời tự phán xét cay độc hoặc sợ hãi bước vào một khởi đầu mới.",
    symbolism: "Chiếc tù và mang cờ chữ thập đỏ, những con người trần trụi giơ tay đón nhận ánh sáng tái sinh từ đại dương của ý thức phổ quát.",
    reflectionPrompt: "Tiếng gọi nội tâm sâu thẳm nhất đang thúc giục bạn tha thứ điều gì và thức tỉnh để làm gì?",
    element: "fire",
    astrologicalSign: "Pluto",
    accentColor: "#85929E",
    categoryMeanings: {
      upright: {
        love: "Bước ngoặt quan trọng, hàn gắn sau rạn nứt hoặc dũng cảm đưa ra quyết định dứt khoát cho tương lai.",
        career: "Nhận ra sứ mệnh nghề nghiệp đích thực, được cất nhắc lên tầm cao mới xứng đáng với năng lực.",
        finance: "Thanh lọc các vấn đề tài chính tồn đọng, đưa ra quyết định tiền bạc mang tính bước ngoặt.",
        self: "Tha thứ cho những sai lầm cũ, tái sinh với tầm nhìn mới mẻ và tâm thế tự do."
      },
      reversed: {
        love: "Nhai lại những lỗi lầm cũ, chì chiết đối phương khiến vết thương không thể khép miệng.",
        career: "Do dự không dám nhận trách nhiệm lớn vì sợ thất bại, bỏ lỡ cơ hội thăng tiến quý giá.",
        finance: "Không chịu học từ những sai lầm đầu tư trong quá khứ dẫn đến lặp lại thất bại cũ.",
        self: "Phê phán bản thân tàn nhẫn, cần học cách bao dung và buông bỏ cảm giác tội lỗi."
      }
    }
  },
  {
    id: "major-21-world",
    number: 21,
    arcana: "major",
    nameEn: "The World",
    nameVi: "Thế Giới Toàn Bích (The World)",
    uprightKeywords: ["Hoàn thành viên mãn", "Hợp nhất", "Thành tựu đỉnh cao", "Du hành", "Trọn vẹn"],
    reversedKeywords: ["Chưa hoàn tất", "Thiếu một bước cuối", "Trì trệ", "Ảo tưởng viên mãn"],
    uprightMeaning: "Lá bài kết thúc của hành trình Major Arcana: vũ nữ nhảy múa uyển chuyển bên trong vòng nguyệt quế xanh tươi. Bạn đã vượt qua mọi bài học số phận và đạt tới sự viên mãn, hòa hợp trọn vẹn giữa bản thân và vũ trụ.",
    reversedMeaning: "Bạn sắp chạm tới đích nhưng còn thiếu một mảnh ghép cuối cùng hoặc thiếu sự kiên nhẫn để khép lại chu trình một cách trọn vẹn nhất.",
    symbolism: "Vòng hoa nguyệt quế hình số không (vòng vô tận), bốn sinh vật đại diện cho bốn nguyên tố và bốn mùa vũ trụ chúc phúc cho sự thành tựu toàn vẹn.",
    reflectionPrompt: "Thành tựu nào bạn đã đạt được và bạn đã sẵn sàng ăn mừng hành trình tuyệt đẹp này chưa?",
    element: "earth",
    astrologicalSign: "Saturn",
    accentColor: "#27AE60",
    categoryMeanings: {
      upright: {
        love: "Tình yêu viên mãn, cái kết hạnh phúc trọn vẹn, sự thấu hiểu và hòa hợp tuyệt đối.",
        career: "Hoàn thành xuất sắc dự án lớn, đạt tới đỉnh cao danh vọng, mở rộng tầm ảnh hưởng quốc tế.",
        finance: "Tài chính đạt tới sự độc lập và thịnh vượng bền vững, không còn nỗi lo thiếu thốn.",
        self: "Cảm giác bình an toàn vẹn, hợp nhất mọi khía cạnh của tâm hồn thành một chỉnh thể hoàn mỹ."
      },
      reversed: {
        love: "Cảm giác còn một khúc mắc chưa được giải quyết dứt điểm để đạt tới sự trọn vẹn.",
        career: "Dự án gần hoàn thành nhưng bị trì hoãn ở những khâu cuối, cần nỗ lực thêm một chút.",
        finance: "Mục tiêu tài chính chưa đạt được 100%, cần kiên trì với kế hoạch đã đề ra.",
        self: "Đừng vội bỏ cuộc khi chỉ còn một bước ngắn nữa là chạm tới đích đến của sự giác ngộ."
      }
    }
  }
];

