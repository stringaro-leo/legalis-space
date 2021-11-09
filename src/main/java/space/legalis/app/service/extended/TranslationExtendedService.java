package space.legalis.app.service.extended;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import space.legalis.app.domain.Translation;
import space.legalis.app.repository.extended.TranslationExtendedRepository;

@Service
@Transactional
public class TranslationExtendedService {

    private final Logger log = LoggerFactory.getLogger(TranslationExtendedService.class);

    private final TranslationExtendedRepository translationExtendedRepository;

    public TranslationExtendedService(TranslationExtendedRepository translationExtendedRepository) {
        this.translationExtendedRepository = translationExtendedRepository;
    }

    public List<Translation> searchTranslationsByTypeAndTypeIdAndLanguage(String type, String typeId, String language) {
        List<Translation> translations = new ArrayList<Translation>();
        if (type.equals("law")) {
            translations = translationExtendedRepository.findTranslationsByLaw_Id(typeId);
        } else if (type.equals("treaty")) {
            translations = translationExtendedRepository.findTranslationsByTreaty_Id(typeId);
        }
        return translations;
    }
}
