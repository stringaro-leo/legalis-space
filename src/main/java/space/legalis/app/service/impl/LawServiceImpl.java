package space.legalis.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import space.legalis.app.domain.Law;
import space.legalis.app.repository.LawRepository;
import space.legalis.app.service.LawService;

/**
 * Service Implementation for managing {@link Law}.
 */
@Service
public class LawServiceImpl implements LawService {

    private final Logger log = LoggerFactory.getLogger(LawServiceImpl.class);

    private final LawRepository lawRepository;

    public LawServiceImpl(LawRepository lawRepository) {
        this.lawRepository = lawRepository;
    }

    @Override
    public Law save(Law law) {
        log.debug("Request to save Law : {}", law);
        return lawRepository.save(law);
    }

    @Override
    public Optional<Law> partialUpdate(Law law) {
        log.debug("Request to partially update Law : {}", law);

        return lawRepository
            .findById(law.getId())
            .map(existingLaw -> {
                if (law.getDescription() != null) {
                    existingLaw.setDescription(law.getDescription());
                }
                if (law.getName() != null) {
                    existingLaw.setName(law.getName());
                }
                if (law.getPublicationDate() != null) {
                    existingLaw.setPublicationDate(law.getPublicationDate());
                }
                if (law.getEffectiveDate() != null) {
                    existingLaw.setEffectiveDate(law.getEffectiveDate());
                }

                return existingLaw;
            })
            .map(lawRepository::save);
    }

    @Override
    public List<Law> findAll() {
        log.debug("Request to get all Laws");
        return lawRepository.findAll();
    }

    @Override
    public Optional<Law> findOne(String id) {
        log.debug("Request to get Law : {}", id);
        return lawRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Law : {}", id);
        lawRepository.deleteById(id);
    }
}
