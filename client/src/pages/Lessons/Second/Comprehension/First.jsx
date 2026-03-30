import {
  Box,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import BackButton from "../../../../components/BackButton";
import ReadingTitle from "../../../../components/ReadingTitle";
import { useTime } from "../../../../hooks/useTime";
import { useParams } from "react-router-dom";
import { useError } from "../../../../contexts/ErrorContext";
import { useCallback, useState } from "react";
import { completeReading } from "../../../../utils/api";
import TrueFalse from "../../../../components/TrueFalse";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import CustomAudio from "../../../../components/CustomAudio";
import CompleteButton from "../../../../components/CompleteButton";
import IncorrectAnswer from "../../../../components/IncorrectAnswer";

const questions = [
  {
    key: "q2-1",
    sentence:
      "1. A __________ is a coworker who always takes credit for group efforts.",
    answer: "SPOTLIGHT HOG",
  },
  {
    key: "q2-2",
    sentence:
      "2. The best way to handle workplace __________ is to avoid engaging in it.",
    answer: "GOSSIP",
  },
  {
    key: "q2-3",
    sentence:
      "3. When dealing with a difficult coworker, it’s important to stay __________ and professional.",
    answer: "CALM",
  },
  {
    key: "q2-4",
    sentence:
      "4. If someone constantly complains, they are called a __________.",
    answer: "BELLYACHER",
  },
  {
    key: "q2-5",
    sentence:
      "5. Workplace __________ can lower employee morale and productivity.",
    answer: "NEGATIVITY",
  },
];

const First = ({ completed = false, score = 0, answers = {}, time = 0 }) => {
  const { timeLeft } = useTime({ completed, time });
  const [loading, setLoading] = useState(false);
  const { readingId, id, categoryId } = useParams();
  const { showError } = useError();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const formData = new FormData(e.target);
        formData.append("time", timeLeft);
        const data = Object.fromEntries(formData.entries());
        await completeReading(readingId, data);
        window.location.reload();
      } catch (error) {
        showError(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    },
    [readingId, showError, timeLeft]
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <BackButton to={`/lesson/${id}/category/${categoryId}`} />
      <ReadingTitle
        title="5 types of difficult coworkers "
        timeLeft={timeLeft}
      />
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            md: 12,
            lg: 8,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Everyone has a story about a difficult coworker. Someone always
              comes to work late, borrows your favorite pen and doesn’t return
              it, or is regularly rude to teammates. Most of the time, a
              difficult teammate’s behavior is annoying yet tolerable. But if
              the behavior becomes a bad habit, it tarnishes the person’s work
              relationships and causes workplace conflict. When that happens,
              it’s time to learn how to deal with a difficult coworker without
              sacrificing professionalism. Why is knowing how to deal with
              difficult coworkers important?{" "}
            </Typography>
            <CustomAudio
              audioUrl="/audios/5 types of difficult people-enhanced-v2.wav"
              type="audio/wav"
            />
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              According to a survey from workforce relocation firm CapRelo, 65%
              of employees talk to coworkers outside of the office. And the
              benefits of workplace friendship go far. Having solid
              relationships with your coworkers improves mental health, boosts
              self-esteem, and helps prevent loneliness. But you can’t become
              friends with everyone, especially at work. The Myers-Briggs
              Company’s Conflict at Work survey found that 36% of workers report
              dealing with conflict often, very often, or all the time. Even if
              you don’t face a difficult coworker every day, there’s still a
              high chance you’ll encounter one once in a while who creates a
              toxic work environment.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              A difficult coworker has the potential to distract you, cause
              stress, and start a further conflict in the office, whether they
              have a short stint on your team or you have to see them every day.
              Learning how to start getting along with toxic coworkers — or at
              least collaborate effectively — can help you avoid larger problems
              and maintain productivity.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Thrive at work with free AIWork is challenging for lots of
              reasons, but most of us have probably come to realize that what
              makes or breaks a professional experience is people – and
              sometimes we encounter a boss, peer, or direct report that isn’t
              at all fun to work with. Amy Gallo is a contributing editor at HBR
              and the author of the book Getting Along: How to Work with Anyone,
              Even Difficult People and the HBR article “How to Navigate
              Conflict with a Coworker.” She shares some of the best ways to
              deal with these kinds of colleagues – how to identify them, engage
              with them, and manage yourself through the conflict.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Dealing with difficult coworkers is a common challenge in many
              workplaces, but it can be especially important for psychology
              students, who will need to apply psychological principles and
              conflict resolution techniques to navigate such relationships.
              Below are some suggested tasks and exercises that psychology
              students can use to better understand and manage difficult
              coworker interactions. If you want to change your workplace, you
              have to start with yourself. It’s easy to feel like difficult
              people are thorns in your side. But before you react and risk a
              potential conflict, take a moment to step back and examine your
              feelings.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Think about why you don’t like this person’s behavior. Are they
              uncooperative? Lazy? Bullying you or other employees?{" "}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              You might dislike coworkers because they remind you of someone
              from your past or qualities you dislike in yourself. Identifying
              these feelings out loud with a friend, coach, or therapist, or
              even privately in a journal, lets you process your emotions and
              relieve stress. Then you can find a workable solution.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Another way to “check yourself” is to examine your own behavior.
              Most people have stories about the headaches their colleagues
              bring to the workweek, but many forget that sometimes, they’re
              someone else’s “difficult coworker.”
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Anyone can have toxic traits, and it’s up to you to reflect and
              ask for feedback on how to change your behavior.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              5 types of difficult coworkers{" "}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              You processed your feelings, adjusted your behavior, and still
              wound up with a toxic coworker. Your next step is learning how to
              disagree with this person without sacrificing your
              professionalism. There are many constructive ways to deal with a
              difficult colleague, but the strategies vary depending on the type
              of employee that’s getting under your skin. Here are five common
              types of difficult coworkers, plus a few tips for managing your
              relationships with them.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>1. The sloth.</b> If you’re a worker with a lot of ambition,
              people who don’t match your energy might get under your skin. They
              don’t work at your pace, and because of this, they seem lazy and
              disengaged. Sloths often finish their work slowly, which is
              particularly frustrating if you depend on their job to do your
              own.
              Young-Woman-Slacking-At-Work-how-to-deal-with-difficult-coworkers
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Solution</b> It’s easy to write off a sloth as lazy, but their
              behavior doesn’t always tell you the whole story. Sometimes, slow
              coworkers are working through challenges, which could be anything
              from health issues to stress and burnout. If your coworkers’ pace
              causes problems, approach them with kindness and respect to
              understand what they need to work more efficiently. Explain how
              their lack of urgency impacts your workload, and ask for clear
              communication about their bandwidth.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              These difficult conversations will often inspire slow coworkers to
              make a change. But if your talks don’t make a difference or you
              aren’t sure how to approach them, you can always ask a manager or
              HR professional to intervene.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>2. The bellyacher.</b> Research shows that negativity at work
              costs businesses around $3 billion per year — and that bad
              atmosphere does more harm than just financial. Coworkers who dwell
              on problems and constantly complain can drain employee morale. Of
              course, everyone benefits from expressing frustration when
              appropriate, but excessive negativity ultimately leads to a toxic
              work environment. When someone starts complaining about you or
              your work, it can hurt your feelings and affect your relationship.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Solution</b> These situations are perfect for checking in with
              yourself. Consider your coworkers’ complaints objectively and
              determine why they’re bothering you. Are they incorrect? Or do
              they point out an issue you’d rather avoid? Consider working with
              your colleague to find a solution together.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              If your colleague’s complaints aren’t valid, or if you can’t make
              a change, offer a new perspective. After a coworker starts
              ranting, saying something like, “I actually enjoyed that meeting”
              can dampen the negative energy in a snap.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>3. The spotlight hog.</b> Teamwork is essential for success,
              and when done right, it yields impressive results. But sometimes
              your team can feel a little off-kilter — especially when one
              person wants more credit than necessary. They might make every
              project about themselves or even stoop to lying about the part
              they played. If so, you’ve got a spotlight hog on your hands.
              Woman-leading-a-meeting-being-center-the-center-of-attention-at-office-how-to-deal-with-difficult-coworkers
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Solution:</b> Most of these people want recognition from their
              coworkers or managers, which could be to mask self-esteem issues.
              Maybe that person feels undervalued and doesn’t know how to react,
              or feels like they don’t have enough responsibility for the
              project in the first place.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Acknowledging the contributions your coworkers make could give
              them the validation they need. And if you still find they want to
              hog the spotlight, don’t be afraid to reach out to your manager to
              clarify the truth and assert expectations about everyone’s role.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>4. The hotshot.</b> Some coworkers think they know it all.
              They’re loud in meetings, rarely accept constructive criticism,
              and often steamroll their team members to ensure their ideas are
              front and center. They don’t know how to work on a team that gives
              everyone an equal voice, leading to an imbalance of power and
              unfair structure.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Solution</b> Like the spotlight hog above, chances are the
              hotshot is looking for validation and appreciation. Try appealing
              to their ego and asking them for advice about a problem you’re
              having. This shows that you value their ideas while modeling a
              scenario that asks for their input actively. That way, they don’t
              have to overtake team conversations.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              But if the problem looms larger, you might have to speak up for
              yourself and other team members. Be clear and direct about how
              their behavior affects everyone’s work without insulting them. If
              it seems to be a symptom of a larger issue with that person, talk
              to your leaders about a more involved intervention.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>5. The gossip. </b> At first glance, the office gossip may seem
              like the opposite of a difficult coworker. They’re friendly and
              personable, always chatting and making friends with people at
              every desk. But once that person turns small talk into gossip,
              they can stir up uncomfortable situations and put you in a
              position you aren’t sure how to handle.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Solution:</b> The best way to handle gossip in the workplace is
              to ignore it. If your coworker wants to share a story that
              oversteps boundaries, leave or politely divert the conversation.
              While this confrontation may be a little awkward, it will help
              create a more harmonious work environment in the long run. And
              since the office gossip likely just wants to make friends, find
              other ways to bond as a team that don’t involve oversharing.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              How to deal with a difficult coworker: 5 tips
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Many factors influence your approach to workplace relationships,
              from your communication style to your personal pet peeves. But
              whether you’re dealing with a sloth, a hotshot, or anything in
              between, these tips can help you learn how to deal with difficult
              coworkers:
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>1. Limit your time together.</b> If a colleague drains and
              demotivates you, limiting your interactions with them is okay.
              Keep your conversations professional, set boundaries in your
              office, and politely excuse yourself from small talk. Just don’t
              give your colleague the cold shoulder — that could cause more
              conflict than necessary.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>2. Regulate your response.</b> Before reacting to a difficult
              coworker or situation, step back and notice how you feel. Your
              reaction could make things worse. If you’re feeling angry or
              upset, avoid lashing out. Separate yourself from the problem and
              try calming techniques like deep breathing. Approach the situation
              clearly once you have a clear head and a calm body.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>3. Stay positive.</b> If negativity depletes employee morale,
              positivity gives it a boost. While you can’t control everyone
              else’s feelings, spreading joy makes the workplace better for
              everyone. Focus on gratitude and cultivating your work-life
              balance so you have the energy to contribute to a positive
              environment.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>4. Remain professional. </b> Try not to let a difficult
              coworker get in the way of your professional goals. Chances are,
              their behavior isn’t about you and just represents a problem
              they’re having. Speak up about it, but protect your energy and
              focus on your own path. It’s easier said than done, but they
              shouldn’t distract you from doing your job.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>5. Ask for help. </b> Sometimes, dealing with difficult
              coworkers takes more than just one conversation. If you have
              difficulty getting through to a colleague or regulating your
              responses to them, it’s time to open a larger conversation with HR
              or your manager. A mentor or coach can also help you manage your
              emotions at work, start difficult conversations, and refocus your
              attention on achieving your goals.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              You spend five days a week at work, and that time should be as
              pleasant as you can make it. When a coworker creates a toxic
              environment, don’t be afraid to take action. Your efforts to learn
              how to deal with difficult coworkers will make your 9–5 a little
              easier — not just for you but for everyone
            </Typography>
          </Paper>
        </Grid2>
        <Grid2
          size={{
            md: 12,
            lg: 4,
          }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            style={{
              position: "sticky",
              top: 0,
              overflow: "auto",
              maxHeight: "100vh",
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Read the statements and decide if they are <i>true</i> or{" "}
                <i>false</i> (correct the false ones).
              </Typography>
              <TrueFalse
                name="q1-1"
                completed={completed}
                answer={completed ? answers["q1-1"] : ""}
                correctAnswer={false}
              >
                1. A difficult coworker always causes workplace conflict.
              </TrueFalse>
              <TrueFalse
                name="q1-2"
                completed={completed}
                answer={completed ? answers["q1-2"] : ""}
                correctAnswer={true}
              >
                2. The &ldquo;hotshot&quot; coworker refuses to accept
                criticism.
              </TrueFalse>
              <TrueFalse
                name="q1-3"
                completed={completed}
                answer={completed ? answers["q1-3"] : ""}
                correctAnswer={true}
              >
                3. Ignoring workplace gossip is the best way to deal with it.
              </TrueFalse>
              <TrueFalse
                name="q1-4"
                completed={completed}
                answer={completed ? answers["q1-4"] : ""}
                correctAnswer={false}
              >
                4. A "sloth" is usually lazy and unmotivated.
              </TrueFalse>
              <TrueFalse
                name="q1-5"
                completed={completed}
                answer={completed ? answers["q1-5"] : ""}
                correctAnswer={false}
              >
                5. Positivity has no real effect on workplace morale.
              </TrueFalse>
            </Paper>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                2. Fill in the Blanks
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                💡 <i>Objective</i>: Reinforce vocabulary and comprehension.
                Complete the sentences using words from the text:
              </Typography>
              {questions.map((q) => (
                <Box key={q.key} sx={{ my: 2 }}>
                  <Typography
                    variant="body1"
                    component="div" // Use div to avoid <p> nesting issues
                    sx={{ lineHeight: 2 }}
                  >
                    {q.sentence.split("__________").map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <>
                            <TextField
                              name={q.key}
                              variant="outlined"
                              size="small"
                              placeholder="Your answer"
                              disabled={completed}
                              defaultValue={answers[q.key] || ""}
                              sx={{
                                mx: 1,
                                width: `${Math.max(
                                  10,
                                  (q.answer?.length || 10) * 15
                                )}px`, // Dynamic width based on input
                                verticalAlign: "middle",
                                "& .MuiInputBase-input": {
                                  paddingY: "0 !important",
                                  textTransform: "uppercase",
                                },
                              }}
                            />
                          </>
                        )}
                      </span>
                    ))}
                    <Box
                      sx={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {completed &&
                        (q.answer === answers[q.key] ? (
                          <CorrectAnswer />
                        ) : (
                          <IncorrectAnswer />
                        ))}
                    </Box>
                  </Typography>
                </Box>
              ))}
            </Paper>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                3. Listen and answer
              </Typography>
              <CustomAudio audioUrl="/audios/coworkers.mp3" type="audio/wav" />
              <Typography variant="subtitle1" gutterBottom>
                After reading the article, what would you say to the following
                individuals as a future psychologist?
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                1. A bossy coworker dismisses your ideas.
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                2. A colleague spreads rumors about another teammate.
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                3. A team member constantly complains about work.
              </Typography>
            </Paper>
            <CompleteButton
              completed={completed}
              loading={loading}
              score={score}
              total={10}
            />
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default First;
